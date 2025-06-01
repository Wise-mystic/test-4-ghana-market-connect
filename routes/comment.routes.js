import express from 'express';
import {
  getCommentsByForum,
  addComment,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { commentSchema } from '../validators/comment.schema.js';

const router = express.Router();

// Public routes
router.get('/forum/:forumId', getCommentsByForum);

// Protected routes
router.post('/forum/:forumId', authenticate, validateRequest(commentSchema), addComment);
router.put('/:id', authenticate, validateRequest(commentSchema), updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router; 