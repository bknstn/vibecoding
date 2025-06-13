import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { validationResult } from 'express-validator';

export const authController = {
  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error during login' });
    }
  },

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;
      const user = await authService.register({ email, password, name });

      if (!user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error during registration' });
    }
  }
}; 