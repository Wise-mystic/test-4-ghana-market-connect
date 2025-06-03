import { validateRequest } from '../middlewares/validate.js';
import Joi from 'joi';

// Validation schemas
const adminRegistrationSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  phone: Joi.string().required().pattern(/^233\d{9}$/).messages({
    'string.pattern.base': 'Phone number must be a valid Ghana number starting with 233'
  }),
  pin: Joi.string().required().length(6).pattern(/^\d+$/).messages({
    'string.pattern.base': 'PIN must be 6 digits',
    'string.length': 'PIN must be 6 digits'
  }),
  location: Joi.string().required(),
  preferredLanguage: Joi.string().required().valid('en', 'tw', 'ga', 'ewe')
});

const adminVerificationSchema = Joi.object({
  phone: Joi.string().required().pattern(/^233\d{9}$/),
  code: Joi.string().required().length(6)
});

// Validation middleware
export const validateAdminRegistration = validateRequest(adminRegistrationSchema);
export const validateAdminVerification = validateRequest(adminVerificationSchema); 