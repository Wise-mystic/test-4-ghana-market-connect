import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(100)
    .trim()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least {#limit} characters long',
      'string.max': 'Product name cannot exceed {#limit} characters'
    }),
  description: Joi.string()
    .required()
    .min(10)
    .max(1000)
    .trim()
    .messages({
      'string.empty': 'Product description is required',
      'string.min': 'Description must be at least {#limit} characters long',
      'string.max': 'Description cannot exceed {#limit} characters'
    }),
  image: Joi.string()
    .required()
    .uri()
    .messages({
      'string.empty': 'Product image is required',
      'string.uri': 'Invalid image URL format',
      'any.required': 'Product image is required'
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
    .insensitive()
    .trim()
    .messages({
      'any.only': 'Category must be one of: vegetables, fruits, tubers, grains, legumes, spices, herbs',
      'any.required': 'Category is required',
      'string.empty': 'Category is required'
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
    .insensitive()
    .trim()
    .messages({
      'any.only': 'Unit must be one of: kg, g, piece, bundle, bag',
      'any.required': 'Unit is required',
      'string.empty': 'Unit is required'
    }),
  location: Joi.string()
    .required()
    .trim()
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
  condition: Joi.string()
    .valid('new', 'used', 'refurbished')
    .required()
    .insensitive()
    .trim()
    .messages({
      'any.only': 'Condition must be one of: new, used, refurbished',
      'any.required': 'Condition is required',
      'string.empty': 'Condition is required'
    }),
  brand: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Brand must be a string',
      'string.empty': 'Brand can be empty'
    }),
  model: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Model must be a string',
      'string.empty': 'Model can be empty'
    }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .allow('')
    .optional()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be at least {#limit}',
      'number.max': 'Year cannot exceed {#limit}',
      'string.empty': 'Year can be empty'
    }),
  color: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Color must be a string',
      'string.empty': 'Color can be empty'
    }),
  size: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Size must be a string',
      'string.empty': 'Size can be empty'
    }),
  weight: Joi.number()
    .min(0)
    .allow('')
    .optional()
    .messages({
      'number.base': 'Weight must be a number',
      'number.min': 'Weight cannot be negative',
      'string.empty': 'Weight can be empty'
    }),
  dimensions: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Dimensions must be a string',
      'string.empty': 'Dimensions can be empty'
    }),
  features: Joi.array()
    .items(Joi.string())
    .allow('')
    .optional()
    .messages({
      'array.base': 'Features must be an array',
      'string.empty': 'Features can be empty'
    }),
  specifications: Joi.object()
    .allow('')
    .optional()
    .messages({
      'object.base': 'Specifications must be an object',
      'string.empty': 'Specifications can be empty'
    }),
  warranty: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Warranty must be a string',
      'string.empty': 'Warranty can be empty'
    }),
  shipping: Joi.object({
    cost: Joi.number()
      .required()
      .min(0)
      .messages({
        'number.base': 'Shipping cost must be a number',
        'number.min': 'Shipping cost cannot be negative',
        'any.required': 'Shipping cost is required'
      }),
    method: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Shipping method is required',
        'string.base': 'Shipping method must be a string'
      }),
    estimatedDays: Joi.number()
      .required()
      .min(1)
      .messages({
        'number.base': 'Estimated shipping days must be a number',
        'number.min': 'Estimated shipping days must be at least {#limit}',
        'any.required': 'Estimated shipping days are required'
      })
  })
    .required()
    .messages({
      'object.base': 'Shipping must be an object',
      'any.required': 'Shipping is required'
    }),
  payment: Joi.object({
    methods: Joi.array()
      .items(Joi.string().trim())
      .min(1)
      .required()
      .messages({
        'array.base': 'Payment methods must be an array',
        'array.min': 'At least one payment method is required',
        'any.required': 'Payment methods are required',
        'array.includesRequiredUnknowns': 'Invalid payment method'
      }),
    currency: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Currency is required',
        'string.base': 'Currency must be a string'
      })
  })
    .required()
    .messages({
      'object.base': 'Payment must be an object',
      'any.required': 'Payment is required'
    })
}); 