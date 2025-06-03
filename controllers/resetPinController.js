import OTPService from '../services/otpService.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const otpService = new OTPService();

export const initiatePinReset = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        // Check if user exists with this phone number
        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this phone number'
            });
        }

        // Send OTP
        const result = await otpService.generateAndSendOTP(phoneNumber);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'OTP sent successfully for PIN reset'
            });
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in initiatePinReset:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyAndResetPin = async (req, res) => {
    try {
        const { phoneNumber, otp, newPin } = req.body;

        // Log the incoming request data (excluding sensitive info)
        console.log('Reset PIN request received for phone:', phoneNumber);

        if (!phoneNumber || !otp || !newPin) {
            return res.status(400).json({
                success: false,
                message: 'Phone number, OTP, and new PIN are required'
            });
        }

        // Validate PIN format (must be 6 digits as per schema)
        if (!/^\d{6}$/.test(newPin)) {
            return res.status(400).json({
                success: false,
                message: 'PIN must be 6 digits'
            });
        }

        // Verify OTP
        console.log('Verifying OTP for phone:', phoneNumber);
        const otpResult = otpService.verifyOTP(phoneNumber, otp);
        console.log('OTP verification result:', otpResult);

        if (!otpResult.success) {
            return res.status(400).json({
                success: false,
                message: otpResult.message || 'Invalid or expired OTP'
            });
        }

        // Find user and update PIN
        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update PIN (the pre-save hook will handle hashing)
        user.pin = newPin;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'PIN reset successfully'
        });
    } catch (error) {
        console.error('Error in verifyAndResetPin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 