import { Product } from '../models/product.model.js';
import { validateProduct } from '../validators/product.validator.js';
import { cloudinary } from '../config/cloudinary.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category })
      .populate('seller', 'name phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    console.log('=== Product Creation Started ===');
    console.log('Raw request body:', req.body);
    console.log('File received:', req.file);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Product image is required'
      });
    }

    // Parse form data
    const productData = {
      name: req.body.name,
      description: req.body.description,
      image: req.file.path, // Use the Cloudinary URL directly
      seller: req.user._id,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      unit: req.body.unit?.toLowerCase().trim(),
      category: req.body.category?.toLowerCase().trim(),
      location: req.body.location,
      stock: Number(req.body.stock),
      condition: req.body.condition?.toLowerCase().trim(),
      shipping: {
        cost: Number(req.body['shipping.cost']),
        method: req.body['shipping.method'],
        estimatedDays: Number(req.body['shipping.estimatedDays'])
      },
      payment: {
        methods: Array.isArray(req.body['payment.methods[]']) 
          ? req.body['payment.methods[]'] 
          : [req.body['payment.methods[]']],
        currency: req.body['payment.currency']
      }
    };

    console.log('Parsed product data:', productData);

    // Create new product
    const product = new Product(productData);

    // Save product
    await product.save();

    console.log('Product saved successfully:', product);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you are not authorized to update it'
      });
    }

    // If new image is uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'winsward/products',
        resource_type: 'auto'
      });
      req.body.image = uploadResult.secure_url;
    }

    // Parse form data
    const updateData = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      stock: Number(req.body.stock),
      shipping: {
        cost: Number(req.body['shipping.cost']),
        method: req.body['shipping.method'],
        estimatedDays: Number(req.body['shipping.estimatedDays'])
      },
      payment: {
        methods: Array.isArray(req.body['payment.methods[]']) 
          ? req.body['payment.methods[]'] 
          : [req.body['payment.methods[]']],
        currency: req.body['payment.currency']
      }
    };

    // Update product
    Object.assign(product, updateData);
    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you are not authorized to delete it'
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get products by user
export const getProductsByUser = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.userId })
      .populate('seller', 'name phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user products',
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
}; 