import OTPService from '../services/otpService.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const otpService = new OTPService();

// Step 1: Request PIN Reset
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

// Step 2: Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and OTP are required'
            });
        }

        // Verify OTP
        const otpResult = otpService.verifyOTP(phoneNumber, otp);
        
        if (!otpResult.success) {
            return res.status(400).json({
                success: false,
                message: otpResult.message || 'Invalid or expired OTP'
            });
        }

        // Generate a temporary token for PIN reset
        const resetToken = jwt.sign(
            { phone: phoneNumber, purpose: 'pin_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully. You can now reset your PIN.',
            data: {
                resetToken
            }
        });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Step 3: Reset PIN
export const resetPin = async (req, res) => {
    try {
        const { newPin, confirmPin } = req.body;
        const resetToken = req.headers.authorization?.split(' ')[1];

        if (!resetToken) {
            return res.status(401).json({
                success: false,
                message: 'Reset token is required'
            });
        }

        // Verify reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.purpose !== 'pin_reset') {
            return res.status(401).json({
                success: false,
                message: 'Invalid reset token'
            });
        }

        if (!newPin || !confirmPin) {
            return res.status(400).json({
                success: false,
                message: 'New PIN and confirm PIN are required'
            });
        }

        // Validate PIN format
        if (!/^\d{6}$/.test(newPin)) {
            return res.status(400).json({
                success: false,
                message: 'PIN must be 6 digits'
            });
        }

        // Check if PINs match
        if (newPin !== confirmPin) {
            return res.status(400).json({
                success: false,
                message: 'PINs do not match'
            });
        }

        // Find user and update PIN
        const user = await User.findOne({ phone: decoded.phone });
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
            message: 'PIN reset successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Error in resetPin:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 