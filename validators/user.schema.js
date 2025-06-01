import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  location: Joi.string(),
  preferredLanguage: Joi.string().valid('en', 'tw', 'ga', 'ewe')
}); 