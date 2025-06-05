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
import { upload, handleMulterError } from '../utils/imageUpload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Protected routes
router.use(authenticate);

// Product management routes
router.post('/', 
    upload.single('image'),
    handleMulterError,
    validateRequest(productSchema),
    createProduct
);

router.put('/:id', 
    upload.single('image'),
    handleMulterError,
    validateRequest(productSchema),
    updateProduct
);

router.delete('/:id', deleteProduct);
router.get('/user/products', getProductsByUser);

export default router; 