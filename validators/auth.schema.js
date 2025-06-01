import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  phone: Joi.string().required().pattern(/^233\d{9}$/),
  pin: Joi.string().required().pattern(/^\d{6}$/),
  role: Joi.string().required().valid('farmer', 'market_woman', 'admin'),
  location: Joi.string().required(),
  preferredLanguage: Joi.string().required().valid('en', 'tw', 'ga', 'ewe')
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