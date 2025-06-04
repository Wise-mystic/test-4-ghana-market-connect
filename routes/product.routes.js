import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUser,
  getProductsByCategory
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { productSchema } from '../validators/product.schema.js';
import upload from '../utils/imageUpload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes
router.use(authenticate);

// Product management routes
router.post('/', 
    validateRequest(productSchema), 
    upload.array('images', 5), // Allow up to 5 images
    createProduct
);
router.put('/:id', 
    validateRequest(productSchema), 
    upload.array('images', 5), // Allow up to 5 images
    updateProduct
);
router.delete('/:id', deleteProduct);
router.get('/user/:userId', getProductsByUser);

export default router; 