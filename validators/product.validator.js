import Joi from 'joi';

export const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(100),
        description: Joi.string().required().min(10),
        price: Joi.number().required().min(0),
        category: Joi.string().required().valid('vegetables', 'fruits', 'tubers', 'grains', 'legumes', 'spices', 'herbs'),
        quantity: Joi.number().required().min(0),
        unit: Joi.string().required().valid('kg', 'g', 'piece', 'bundle', 'bag'),
        location: Joi.string().required(),
        stock: Joi.number().required().min(0),
        images: Joi.array().items(Joi.string()).min(1).required()
    });

    return schema.validate(data);
}; 