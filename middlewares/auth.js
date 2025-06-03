import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/user.model.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.id).select('-pin');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
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
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
}; 