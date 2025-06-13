import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { validationResult } from 'express-validator';

export const userController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  },

  async createUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  },

  async updateUser(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const id = parseInt(req.params.id);
      const user = await userService.update(id, req.body);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await userService.delete(id);

      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  }
}; 