import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';

const router = express.Router();

// Route to send OTP
router.post('/send', sendOTP);

// Route to verify OTP
router.post('/verify', verifyOTP);

export default router; 