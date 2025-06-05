import Joi from 'joi';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../config/languages.js';

const validLanguages = Object.values(LANGUAGES);

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  phone: Joi.string().required().pattern(/^233\d{9}$/),
  pin: Joi.string().required().pattern(/^\d{6}$/),
  role: Joi.string().required().valid('farmer', 'market_woman', 'admin'),
  location: Joi.string().required(),
  preferredLanguage: Joi.string()
    .required()
    .valid(...validLanguages)
    .default(DEFAULT_LANGUAGE)
    .messages({
      'any.only': 'Please select a valid language preference. Available languages: ' + validLanguages.join(', ')
    })
});

export const loginSchema = Joi.object({
  phone: Joi.string().required().pattern(/^233\d{9}$/),
  pin: Joi.string().required().pattern(/^\d{6}$/)
});

export const otpSchema = Joi.object({
  phone: Joi.string().required().pattern(/^233\d{9}$/),
  otp: Joi.string().pattern(/^\d{6}$/).when('$isVerify', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
});

export const resetPinSchema = Joi.object({
  phone: Joi.string().required().pattern(/^233\d{9}$/),
  newPin: Joi.string().required().pattern(/^\d{6}$/),
  otp: Joi.string().required().pattern(/^\d{6}$/)
}); 