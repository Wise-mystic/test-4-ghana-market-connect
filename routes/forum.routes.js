import express from 'express';
import {
  getAllForums,
  getForumById,
  createForum,
  updateForum,
  deleteForum,
  getForumsByCategory,
  likeForum,
  unlikeForum,
  reportForum
} from '../controllers/forum.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { forumSchema } from '../validators/forum.schema.js';

const router = express.Router();

// Public routes
router.get('/', getAllForums);
router.get('/category/:category', getForumsByCategory);
router.get('/:id', getForumById);

// Protected routes
router.use(authenticate);

// Forum management routes
router.post('/', validateRequest(forumSchema), createForum);
router.put('/:id', validateRequest(forumSchema), updateForum);
router.delete('/:id', deleteForum);

// Forum interaction routes
router.post('/:id/like', likeForum);
router.delete('/:id/like', unlikeForum);
router.post('/:id/report', reportForum);

export default router; 