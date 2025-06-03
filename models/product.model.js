// product schema defining the product document structure
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['vegetables', 'fruits', 'tubers', 'grains', 'legumes', 'spices', 'herbs']
  },
  unit: {
    type: String,
    required: [true, 'Unit of measurement is required'],
    enum: ['kg', 'g', 'piece', 'bundle', 'bag']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);