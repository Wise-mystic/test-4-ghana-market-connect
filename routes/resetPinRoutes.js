import express from 'express';
import { initiatePinReset, verifyAndResetPin } from '../controllers/resetPinController.js';

const router = express.Router();

// Route to initiate PIN reset (sends OTP)
router.post('/initiate', initiatePinReset);

// Route to verify OTP and reset PIN
router.post('/verify-and-reset', verifyAndResetPin);

export default router; 