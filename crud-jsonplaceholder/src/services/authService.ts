import { query } from '../config/database';
import { User, JwtPayload } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User } | null> {
    const result = await query(`
      SELECT u.*, a.password_hash
      FROM users u
      JOIN auth a ON u.id = a.user_id
      WHERE u.email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return null;
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'user'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        role: user.role
      }
    };
  },

  async register(userData: { email: string; password: string; name: string }): Promise<User | null> {
    const client = await query.getClient();
    try {
      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );

      if (existingUser.rows.length > 0) {
        return null;
      }

      // Create user
      const userResult = await client.query(`
        INSERT INTO users (name, email, username)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [userData.name, userData.email, userData.email.split('@')[0]]);

      // Create auth record
      const passwordHash = await bcrypt.hash(userData.password, 10);
      await client.query(`
        INSERT INTO auth (user_id, password_hash)
        VALUES ($1, $2)
      `, [userResult.rows[0].id, passwordHash]);

      await client.query('COMMIT');

      return {
        id: userResult.rows[0].id,
        name: userData.name,
        email: userData.email,
        username: userData.email.split('@')[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}; 