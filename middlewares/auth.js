import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/env.js';
import User from '../models/user.model.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-pin -otp');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error authenticating user',
      error: error.message
    });
  }
};

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error authenticating admin',
      error: error.message
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Insufficient permissions'
      });
    }

    next();
  };
}; 