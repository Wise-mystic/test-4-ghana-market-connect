import Joi from 'joi';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../config/languages.js';

const validLanguages = Object.values(LANGUAGES);

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  location: Joi.string(),
  preferredLanguage: Joi.string()
    .valid(...validLanguages)
    .messages({
      'any.only': 'Please select a valid language preference. Available languages: ' + validLanguages.join(', ')
    })
});

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name must not exceed {#limit} characters'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least {#limit} characters long'
    }),
  preferredLanguage: Joi.string()
    .valid(...validLanguages)
    .default(DEFAULT_LANGUAGE)
    .messages({
      'any.only': 'Please select a valid language preference. Available languages: ' + validLanguages.join(', ')
    })
}); 