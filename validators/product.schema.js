import Joi from 'joi';

export const productSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  image: Joi.string().uri(),
  price: Joi.number().min(0)
}); 