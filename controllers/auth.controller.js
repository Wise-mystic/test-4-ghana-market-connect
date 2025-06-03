import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import { requestOTP, verifyOTPCode, clearOTP } from '../services/otp.service.js';

// Development fallback for SMS
const isDevelopment = process.env.NODE_ENV === 'development';

const handleSMSFailure = async (phone, code, type) => {
  if (isDevelopment) {
    console.log(`[DEVELOPMENT MODE] ${type} code for ${phone}: ${code}`);
    return true;
  }
  throw new Error(`Failed to send ${type} SMS`);
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, phone, pin, role, location, preferredLanguage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      phone,
      pin,
      role,
      location,
      preferredLanguage,
      isVerified: false
    });

    // Generate and send verification OTP
    const otp = requestOTP(phone);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your account with the code sent to your phone.',
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
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or PIN'
      });
    }

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or PIN'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Request OTP for verification
export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and store OTP
    const otp = requestOTP(phone);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone,
        expiryMinutes: 10
      }
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting OTP',
      error: error.message
    });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Verify OTP
    const isValid = verifyOTPCode(phone, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update user verification status
    const user = await User.findOneAndUpdate(
      { phone },
      { isVerified: true },
      { new: true }
    );

    // Clear OTP after successful verification
    clearOTP(phone);

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Request PIN reset
export const requestPinReset = async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and store OTP
    const otp = requestOTP(phone);

    res.status(200).json({
      success: true,
      message: 'PIN reset OTP sent successfully',
      data: {
        phone,
        expiryMinutes: 10
      }
    });
  } catch (error) {
    console.error('Error requesting PIN reset:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting PIN reset',
      error: error.message
    });
  }
};

// Reset PIN
export const resetPin = async (req, res) => {
  try {
    const { phone, otp, newPin } = req.body;

    // Verify OTP
    const isValid = verifyOTPCode(phone, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update user PIN
    const user = await User.findOneAndUpdate(
      { phone },
      { pin: newPin },
      { new: true }
    );

    // Clear OTP after successful reset
    clearOTP(phone);

    res.status(200).json({
      success: true,
      message: 'PIN reset successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error resetting PIN:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting PIN',
      error: error.message
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-pin');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
}; 