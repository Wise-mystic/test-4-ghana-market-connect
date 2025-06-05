import Joi from 'joi';

export const validateProduct = (data) => {
    // Convert FormData values to appropriate types
    const processedData = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseFloat(data.quantity),
        stock: parseFloat(data.stock),
        // Handle images array from FormData
        images: data.images ? (Array.isArray(data.images) ? data.images : [data.images]) : []
    };

    const schema = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(100)
            .messages({
                'string.empty': 'Product name is required',
                'string.min': 'Product name must be at least {#limit} characters long',
                'string.max': 'Product name cannot exceed {#limit} characters'
            }),
        description: Joi.string()
            .required()
            .min(10)
            .messages({
                'string.empty': 'Product description is required',
                'string.min': 'Description must be at least {#limit} characters long'
            }),
        price: Joi.number()
            .required()
            .min(0)
            .messages({
                'number.base': 'Price must be a number',
                'number.min': 'Price cannot be negative',
                'any.required': 'Price is required'
            }),
        category: Joi.string()
            .required()
            .valid('vegetables', 'fruits', 'tubers', 'grains', 'legumes', 'spices', 'herbs')
            .messages({
                'any.only': 'Category must be one of: vegetables, fruits, tubers, grains, legumes, spices, herbs',
                'any.required': 'Category is required'
            }),
        quantity: Joi.number()
            .required()
            .min(0)
            .messages({
                'number.base': 'Quantity must be a number',
                'number.min': 'Quantity cannot be negative',
                'any.required': 'Quantity is required'
            }),
        unit: Joi.string()
            .required()
            .valid('kg', 'g', 'piece', 'bundle', 'bag')
            .messages({
                'any.only': 'Unit must be one of: kg, g, piece, bundle, bag',
                'any.required': 'Unit is required'
            }),
        location: Joi.string()
            .required()
            .messages({
                'string.empty': 'Location is required'
            }),
        stock: Joi.number()
            .required()
            .min(0)
            .messages({
                'number.base': 'Stock must be a number',
                'number.min': 'Stock cannot be negative',
                'any.required': 'Stock is required'
            }),
        images: Joi.array()
            .items(Joi.string())
            .min(1)
            .required()
            .messages({
                'array.min': 'At least one image is required',
                'array.base': 'Images must be an array',
                'any.required': 'Images are required'
            })
    });

    return schema.validate(processedData);
}; 