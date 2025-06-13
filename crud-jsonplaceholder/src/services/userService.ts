import { query } from '../config/database';
import { User, UserWithAuth } from '../types';
import bcrypt from 'bcrypt';

export const userService = {
  async findAll(): Promise<User[]> {
    const result = await query(`
      SELECT u.*, 
             a.street, a.suite, a.city, a.zipcode, a.geo_lat, a.geo_lng,
             c.name as company_name, c.catch_phrase, c.bs
      FROM users u
      LEFT JOIN addresses a ON u.address_id = a.id
      LEFT JOIN companies c ON u.company_id = c.id
    `);
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      phone: row.phone,
      website: row.website,
      address: {
        street: row.street,
        suite: row.suite,
        city: row.city,
        zipcode: row.zipcode,
        geo: {
          lat: row.geo_lat,
          lng: row.geo_lng
        }
      },
      company: {
        name: row.company_name,
        catchPhrase: row.catch_phrase,
        bs: row.bs
      }
    }));
  },

  async findById(id: number): Promise<User | null> {
    const result = await query(`
      SELECT u.*, 
             a.street, a.suite, a.city, a.zipcode, a.geo_lat, a.geo_lng,
             c.name as company_name, c.catch_phrase, c.bs
      FROM users u
      LEFT JOIN addresses a ON u.address_id = a.id
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      phone: row.phone,
      website: row.website,
      address: {
        street: row.street,
        suite: row.suite,
        city: row.city,
        zipcode: row.zipcode,
        geo: {
          lat: row.geo_lat,
          lng: row.geo_lng
        }
      },
      company: {
        name: row.company_name,
        catchPhrase: row.catch_phrase,
        bs: row.bs
      }
    };
  },

  async create(userData: UserWithAuth): Promise<User> {
    const client = await query.getClient();
    try {
      await client.query('BEGIN');

      // Insert address
      const addressResult = await client.query(`
        INSERT INTO addresses (street, suite, city, zipcode, geo_lat, geo_lng)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        userData.address?.street,
        userData.address?.suite,
        userData.address?.city,
        userData.address?.zipcode,
        userData.address?.geo.lat,
        userData.address?.geo.lng
      ]);

      // Insert company
      const companyResult = await client.query(`
        INSERT INTO companies (name, catch_phrase, bs)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [
        userData.company?.name,
        userData.company?.catchPhrase,
        userData.company?.bs
      ]);

      // Insert user
      const userResult = await client.query(`
        INSERT INTO users (name, username, email, phone, website, address_id, company_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        userData.name,
        userData.username,
        userData.email,
        userData.phone,
        userData.website,
        addressResult.rows[0].id,
        companyResult.rows[0].id
      ]);

      // Insert auth
      const passwordHash = await bcrypt.hash(userData.password!, 10);
      await client.query(`
        INSERT INTO auth (user_id, password_hash)
        VALUES ($1, $2)
      `, [userResult.rows[0].id, passwordHash]);

      await client.query('COMMIT');

      return this.findById(userResult.rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const client = await query.getClient();
    try {
      await client.query('BEGIN');

      const user = await this.findById(id);
      if (!user) {
        return null;
      }

      // Update address if provided
      if (userData.address) {
        await client.query(`
          UPDATE addresses
          SET street = $1, suite = $2, city = $3, zipcode = $4, geo_lat = $5, geo_lng = $6
          WHERE id = $7
        `, [
          userData.address.street,
          userData.address.suite,
          userData.address.city,
          userData.address.zipcode,
          userData.address.geo.lat,
          userData.address.geo.lng,
          user.address_id
        ]);
      }

      // Update company if provided
      if (userData.company) {
        await client.query(`
          UPDATE companies
          SET name = $1, catch_phrase = $2, bs = $3
          WHERE id = $4
        `, [
          userData.company.name,
          userData.company.catchPhrase,
          userData.company.bs,
          user.company_id
        ]);
      }

      // Update user
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      if (userData.name) {
        updateFields.push(`name = $${paramCount}`);
        values.push(userData.name);
        paramCount++;
      }
      if (userData.username) {
        updateFields.push(`username = $${paramCount}`);
        values.push(userData.username);
        paramCount++;
      }
      if (userData.email) {
        updateFields.push(`email = $${paramCount}`);
        values.push(userData.email);
        paramCount++;
      }
      if (userData.phone) {
        updateFields.push(`phone = $${paramCount}`);
        values.push(userData.phone);
        paramCount++;
      }
      if (userData.website) {
        updateFields.push(`website = $${paramCount}`);
        values.push(userData.website);
        paramCount++;
      }

      if (updateFields.length > 0) {
        values.push(id);
        await client.query(`
          UPDATE users
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
        `, values);
      }

      await client.query('COMMIT');
      return this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}; 