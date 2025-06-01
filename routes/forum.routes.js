import express from 'express';
import {
  getAllForums,
  getForumById,
  createForum,
  updateForum,
  deleteForum,
  getForumsByCategory
} from '../controllers/forum.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { forumSchema } from '../validators/forum.schema.js';

const router = express.Router();

// Public routes
router.get('/', getAllForums);
router.get('/:id', getForumById);
router.get('/category/:category', getForumsByCategory);

// Protected routes
router.post('/', authenticate, validateRequest(forumSchema), createForum);
router.put('/:id', authenticate, validateRequest(forumSchema), updateForum);
router.delete('/:id', authenticate, deleteForum);

export default router; 