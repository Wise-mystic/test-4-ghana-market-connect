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
// Import the upload middleware for parsing form-data text fields
import { upload } from '../middlewares/multer.js';
// We will no longer use the imageUpload middleware here, as image upload is separate
// import { upload, handleMulterError } from '../utils/imageUpload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Protected routes
router.use(authenticate);

// Product management routes
// Use multer middleware here just to parse form-data text fields
router.post('/', 
    upload.none(), // Use .none() to handle only text fields
    validateRequest(productSchema),
    createProduct
);

router.put('/:id', 
    upload.none(), // Use .none() to handle only text fields
    validateRequest(productSchema),
    updateProduct
);

router.delete('/:id', deleteProduct);
router.get('/user/products', getProductsByUser);

export default router; 