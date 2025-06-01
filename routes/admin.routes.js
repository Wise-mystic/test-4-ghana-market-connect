import express from 'express';
import {
  getDashboardOverview,
  getReportedContent,
  handleReportedContent
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardOverview);

// Content moderation routes
router.get('/reported-content', getReportedContent);
router.post('/reported-content/:id', handleReportedContent);

export default router; 