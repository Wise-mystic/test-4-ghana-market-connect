import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  requestOTP,
  verifyOTP,
  resetPIN
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  otpSchema,
  resetPinSchema
} from '../validators/auth.schema.js';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/request-otp', validateRequest(otpSchema), requestOTP);
router.post('/verify-otp', validateRequest(otpSchema), verifyOTP);
router.post('/reset-pin', validateRequest(resetPinSchema), resetPIN);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router; 