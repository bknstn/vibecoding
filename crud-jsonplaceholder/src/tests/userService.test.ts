import { userService } from '../services/userService';
import { query } from '../config/database';

// Mock the database query function
jest.mock('../config/database', () => ({
  query: jest.fn(),
  getClient: jest.fn()
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
          website: 'johndoe.com',
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'New York',
          zipcode: '10001',
          geo_lat: '40.7128',
          geo_lng: '-74.0060',
          company_name: 'Company A',
          catch_phrase: 'Best company ever',
          bs: 'Making things better'
        }
      ];

      (query as jest.Mock).mockResolvedValue({ rows: mockUsers });

      const result = await userService.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '123-456-7890',
        website: 'johndoe.com',
        address: {
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'New York',
          zipcode: '10001',
          geo: {
            lat: '40.7128',
            lng: '-74.0060'
          }
        },
        company: {
          name: 'Company A',
          catchPhrase: 'Best company ever',
          bs: 'Making things better'
        }
      });
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '123-456-7890',
        website: 'johndoe.com',
        street: '123 Main St',
        suite: 'Apt 1',
        city: 'New York',
        zipcode: '10001',
        geo_lat: '40.7128',
        geo_lng: '-74.0060',
        company_name: 'Company A',
        catch_phrase: 'Best company ever',
        bs: 'Making things better'
      };

      (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

      const result = await userService.findById(1);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '123-456-7890',
        website: 'johndoe.com',
        address: {
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'New York',
          zipcode: '10001',
          geo: {
            lat: '40.7128',
            lng: '-74.0060'
          }
        },
        company: {
          name: 'Company A',
          catchPhrase: 'Best company ever',
          bs: 'Making things better'
        }
      });
    });

    it('should return null when user is not found', async () => {
      (query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await userService.findById(999);

      expect(result).toBeNull();
    });
  });
}); 