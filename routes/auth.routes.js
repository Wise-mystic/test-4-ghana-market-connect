import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  requestOtp,
  verifyOtp,
  requestPinReset,
  resetPin
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateOtpRequest,
  validateOtpVerification,
  validatePinReset
} from '../validators/auth.validator.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/request-otp', validateOtpRequest, requestOtp);
router.post('/verify-otp', validateOtpVerification, verifyOtp);

// PIN reset routes
router.post('/request-pin-reset', validateOtpRequest, requestPinReset);
router.post('/reset-pin', validatePinReset, resetPin);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router; 