import Joi from 'joi';
import { validateRequest } from '../middlewares/validate.js';

// Registration validation schema
const registrationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  phone: Joi.string()
    .pattern(/^233\d{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid Ghana phone number (233XXXXXXXXX)'
    }),
  pin: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'PIN is required',
      'string.length': 'PIN must be 6 digits',
      'string.pattern.base': 'PIN must contain only numbers'
    }),
  role: Joi.string()
    .valid('market_woman', 'logistics', 'admin', 'farmer')
    .required()
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Role must be one of: market_woman, logistics, admin, farmer'
    }),
  location: Joi.string()
    .required()
    .messages({
      'string.empty': 'Location is required'
    }),
  preferredLanguage: Joi.string()
    .valid('en', 'tw', 'ga', 'da', 'ew')
    .default('en')
});

// Login validation schema
const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^233\d{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid Ghana phone number (233XXXXXXXXX)'
    }),
  pin: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'PIN is required',
      'string.length': 'PIN must be 6 digits',
      'string.pattern.base': 'PIN must contain only numbers'
    })
});

// OTP request validation schema
const otpRequestSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^233\d{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid Ghana phone number (233XXXXXXXXX)'
    })
});

// OTP verification validation schema
const otpVerificationSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^233\d{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid Ghana phone number (233XXXXXXXXX)'
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    })
});

// PIN reset validation schema
const pinResetSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^233\d{9}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid Ghana phone number (233XXXXXXXXX)'
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    }),
  newPin: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'New PIN is required',
      'string.length': 'PIN must be 6 digits',
      'string.pattern.base': 'PIN must contain only numbers'
    })
});

// Export validation middleware
export const validateRegistration = validateRequest(registrationSchema);
export const validateLogin = validateRequest(loginSchema);
export const validateOtpRequest = validateRequest(otpRequestSchema);
export const validateOtpVerification = validateRequest(otpVerificationSchema);
export const validatePinReset = validateRequest(pinResetSchema); 