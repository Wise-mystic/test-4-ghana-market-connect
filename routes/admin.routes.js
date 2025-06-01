import express from 'express';
import {
  getDashboardOverview,
  getReportedContent,
  handleReportedContent
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Admin routes
router.get('/dashboard', getDashboardOverview);
router.get('/reported-content', getReportedContent);
router.put('/reported-content/:id', handleReportedContent);

export default router; 