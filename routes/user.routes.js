import express from 'express';
import {
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  getAllUsers
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { updateUserSchema } from '../validators/user.schema.js';

const router = express.Router();

// Protected routes
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, validateRequest(updateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.get('/role/:role', authenticate, getUsersByRole);
router.get('/', authenticate, authorize('admin'), getAllUsers);

export default router; 