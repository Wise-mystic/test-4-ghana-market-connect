import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  reportComment
} from '../controllers/comment.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { commentSchema } from '../validators/comment.schema.js';

const router = express.Router();

// Public routes
router.get('/forum/:forumId', getComments);

// Protected routes
router.use(authenticate);

// Comment management routes
router.post('/', validateRequest(commentSchema), createComment);
router.put('/:id', validateRequest(commentSchema), updateComment);
router.delete('/:id', deleteComment);

// Comment interaction routes
router.post('/:id/like', likeComment);
router.delete('/:id/like', unlikeComment);
router.post('/:id/report', reportComment);

export default router; 