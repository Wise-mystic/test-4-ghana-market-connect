import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      console.log('=== Validation Started ===');
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));
      console.log('Files:', req.file ? JSON.stringify(req.file, null, 2) : 'No files');

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

      // Handle image file - assuming separate upload, only expect URL string in body
      if (req.body.image) {
        data.image = req.body.image; // Use the image URL from the request body
      } else {
          // If no image URL is provided, ensure the field is not present or is null/undefined
          // depending on how Joi optional().allow('') is handled.
          // Joi with optional().allow('') should handle missing or empty string, so no need to explicitly delete if missing.
      }

      // Handle payment methods array
      let paymentMethods = [];
      
      console.log('Checking for payment.methods[]:', req.body['payment.methods[]']);
      // Check for array notation
      if (req.body['payment.methods[]']) {
        if (Array.isArray(req.body['payment.methods[]'])) {
          paymentMethods = req.body['payment.methods[]'];
        } else {
          paymentMethods = [req.body['payment.methods[]']];
        }
      }
      
      console.log('Checking for payment.methods:', req.body['payment.methods']);
      // Check for regular notation
      if (req.body['payment.methods']) {
        if (Array.isArray(req.body['payment.methods'])) {
          paymentMethods = req.body['payment.methods'];
        } else {
          paymentMethods = [req.body['payment.methods']];
        }
      }

      console.log('Processed paymentMethods array before check:', paymentMethods);

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

      // Remove any undefined or null values from top level of data object before Joi validation
      // Joi will handle nested undefined/null based on schema
      Object.keys(data).forEach(key => {
        if (data[key] === undefined || data[key] === null) {
          // Special handling for empty strings that should be allowed by Joi optional().allow('')
          // If a field is optional and sent as an empty string, we should keep it as an empty string
          // unless the schema specifically disallows it.
          // Given the current productSchema, Joi handles optional empty strings correctly.
          // So, we only need to delete truly undefined or null top-level keys.
           if (typeof data[key] !== 'string' || data[key] !== '') {
             delete data[key];
           }
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
        field: detail.path[0], // Assuming path is always at least depth 1
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