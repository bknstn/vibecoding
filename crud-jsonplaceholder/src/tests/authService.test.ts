import { authService } from '../services/authService';
import { query } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the database query function
jest.mock('../config/database', () => ({
  query: jest.fn(),
  getClient: jest.fn()
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return user and token on successful login', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user'
      };

      (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      const result = await authService.login('john@example.com', 'password123');

      expect(result).toEqual({
        user: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          role: 'user'
        },
        token: 'mock_token'
      });
    });

    it('should throw error when user is not found', async () => {
      (query as jest.Mock).mockResolvedValue({ rows: [] });

      await expect(authService.login('nonexistent@example.com', 'password123'))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should throw error when password is incorrect', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user'
      };

      (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login('john@example.com', 'wrong_password'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should create a new user and return user data', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'user'
      };

      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [mockUser] }); // Insert user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await authService.register({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw error when email already exists', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'user'
      };

      (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

      await expect(authService.register({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      }))
        .rejects
        .toThrow('Email already exists');
    });
  });
}); 