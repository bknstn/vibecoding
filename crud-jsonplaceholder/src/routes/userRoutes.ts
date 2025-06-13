import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('phone').optional(),
  body('website').optional().isURL().withMessage('Valid URL is required'),
  body('address').optional().isObject(),
  body('address.street').optional().notEmpty(),
  body('address.suite').optional(),
  body('address.city').optional().notEmpty(),
  body('address.zipcode').optional().notEmpty(),
  body('address.geo').optional().isObject(),
  body('address.geo.lat').optional().notEmpty(),
  body('address.geo.lng').optional().notEmpty(),
  body('company').optional().isObject(),
  body('company.name').optional().notEmpty(),
  body('company.catchPhrase').optional(),
  body('company.bs').optional()
];

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Protected routes
router.post('/', authenticateToken, userValidation, userController.createUser);
router.put('/:id', authenticateToken, userValidation, userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);

export default router; 