import { Router } from 'express';
import { authController } from '../controllers/authController';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')
];

// Public routes
router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);

export default router; 