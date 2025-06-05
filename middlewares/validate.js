import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      console.log('=== Validation Started ===');
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));
      console.log('Files:', req.file ? JSON.stringify(req.file, null, 2) : 'No files');

      // Check for image file first
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [{
            field: 'image',
            message: 'Product image is required. Please upload an image file.'
          }]
        });
      }

      // Parse form data
      const data = {
        ...req.body,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        stock: Number(req.body.stock),
        category: req.body.category?.toLowerCase().trim(),
        unit: req.body.unit?.toLowerCase().trim(),
        condition: req.body.condition?.toLowerCase().trim(),
        shipping: {
          cost: Number(req.body['shipping.cost']),
          method: req.body['shipping.method'],
          estimatedDays: Number(req.body['shipping.estimatedDays'])
        }
      };

      // Set the image from the uploaded file
      data.image = req.file.path;

      // Handle payment methods array
      let paymentMethods = [];
      
      // Check for array notation
      if (req.body['payment.methods[]']) {
        if (Array.isArray(req.body['payment.methods[]'])) {
          paymentMethods = req.body['payment.methods[]'];
        } else {
          paymentMethods = [req.body['payment.methods[]']];
        }
      }
      
      // Check for regular notation
      if (req.body['payment.methods']) {
        if (Array.isArray(req.body['payment.methods'])) {
          paymentMethods = req.body['payment.methods'];
        } else {
          paymentMethods = [req.body['payment.methods']];
        }
      }

      // Ensure we have at least one payment method
      if (paymentMethods.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [{
            field: 'payment',
            message: 'At least one payment method is required'
          }]
        });
      }

      data.payment = {
        methods: paymentMethods,
        currency: req.body['payment.currency']
      };

      // Remove any undefined or null values
      Object.keys(data).forEach(key => {
        if (data[key] === undefined || data[key] === null) {
          delete data[key];
        }
      });

      console.log('Processed data for validation:', JSON.stringify(data, null, 2));

      const { error } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
      });

      if (error) {
        console.log('Validation errors:', error.details);
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      // Add validated data to request
      req.validatedData = data;
      next();
    } catch (err) {
      console.error('Validation error:', err);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: err.message
      });
    }
  };
}; 