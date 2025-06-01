export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      context: { isVerify: req.path.includes('verify') }
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
}; 