import { Product } from '../models/product.model.js';
// We no longer validate file upload here, validation for image URL is in schema
// import { validateProduct } from '../validators/product.validator.js';
// Cloudinary config is not needed directly in controller for this workflow
// import { cloudinary } from '../config/cloudinary.js';

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
    console.log('=== Product Creation Started in Controller ===');
    console.log('Raw request body:', req.body);

    // req.file is no longer processed here, expecting image URL in body
    // Check if file was uploaded
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Product image is required'
    //   });
    // }

    // Parsed and validated data is in req.validatedData after validateRequest middleware
    const productData = {
      ...req.validatedData,
      seller: req.user._id,
      // image is now expected as a string URL in req.validatedData
    };

    console.log('Final product data for creation:', productData);

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

    // If new image is uploaded - this logic moves to the /upload route
    // if (req.file) {
    //   const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //     folder: 'winsward/products',
    //     resource_type: 'auto'
    //   });
    //   req.body.image = uploadResult.secure_url;
    // }

    // Parsed and validated data is in req.validatedData after validateRequest middleware
    const updateData = {
      ...req.validatedData,
      // image is now expected as a string URL in req.validatedData
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