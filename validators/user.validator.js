import { registerUserSchema, updateUserSchema } from './user.schema.js';
import { getMessage } from '../config/languages.js';

export const validateRegistration = (req, res, next) => {
  const { error } = registerUserSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: getMessage(req.language, detail.type) || detail.message
    }));
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

export const validateUpdate = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: getMessage(req.language, detail.type) || detail.message
    }));
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
}; 