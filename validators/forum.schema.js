import Joi from 'joi';

export const forumSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  content: Joi.string().required().min(10),
  category: Joi.string().valid('general', 'farming', 'marketing', 'logistics', 'health').default('general'),
  tags: Joi.array().items(Joi.string())
});

export const reportSchema = Joi.object({
  reason: Joi.string().required().min(10).max(500)
}); 