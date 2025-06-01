import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByUser
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { productSchema } from '../validators/product.schema.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Protected routes
router.post('/', authenticate, validateRequest(productSchema), createProduct);
router.put('/:id', authenticate, validateRequest(productSchema), updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.get('/user/:userId', authenticate, getProductsByUser);

export default router; 