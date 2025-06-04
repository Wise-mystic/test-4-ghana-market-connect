import express from 'express';
import { initiatePinReset, verifyOtp, resetPin } from '../controllers/resetPinController.js';

const router = express.Router();

// Step 1: Request PIN Reset
router.post('/initiate', initiatePinReset);

// Step 2: Verify OTP
router.post('/verify', verifyOtp);

// Step 3: Reset PIN
router.post('/reset', resetPin);

export default router; 