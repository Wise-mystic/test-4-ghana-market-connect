import Joi from 'joi';

export const productSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10),
  image: Joi.string().uri(),
  price: Joi.number().min(0),
  category: Joi.string().required().valid('vegetables', 'fruits', 'grains', 'tubers', 'other'),
  quantity: Joi.number().required().min(0),
  unit: Joi.string().required().valid('kg', 'g', 'l', 'ml', 'piece')
}); 