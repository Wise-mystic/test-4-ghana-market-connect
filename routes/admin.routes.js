import express from 'express';
import {
  getDashboardOverview,
  getReportedContent,
  handleReportedContent,
  registerAdmin,
  verifyAdmin
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateAdminRegistration, validateAdminVerification } from '../validators/admin.validator.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Admin routes
router.get('/dashboard', getDashboardOverview);
router.get('/reported-content', getReportedContent);
router.put('/reported-content/:id', handleReportedContent);

// Private route for admin registration (protected by middleware)
router.post('/register', validateAdminRegistration, registerAdmin);

// Route for admin verification
router.post('/verify', validateAdminVerification, verifyAdmin);

export default router; 