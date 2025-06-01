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

// Public routes
router.get('/role/:role', getUsersByRole);

// Protected routes
router.use(authenticate);

// User profile routes
router.get('/:id', getUserById);
router.put('/:id', validateRequest(updateUserSchema), updateUser);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.delete('/:id', authorize('admin'), deleteUser);

export default router; 