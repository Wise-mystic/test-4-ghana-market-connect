import Joi from 'joi';

export const commentSchema = Joi.object({
  content: Joi.string().required().min(1).max(1000)
}); 