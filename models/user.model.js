//user schema with role management
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { LANGUAGES, DEFAULT_LANGUAGE, getMessage } from '../config/languages.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^233\d{9}$/, 'Please enter a valid Ghana phone number (233XXXXXXXXX)']
  },
  pin: {
    type: String,
    required: [true, 'PIN is required'],
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: 'PIN must be exactly 6 digits'
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['market_woman', 'logistics', 'admin', 'farmer'],
    default: 'farmer'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  preferredLanguage: {
    type: String,
    enum: {
      values: Object.values(LANGUAGES),
      message: function(props) {
        return getMessage(props.value || DEFAULT_LANGUAGE, 'selectLanguage');
      }
    },
    default: DEFAULT_LANGUAGE,
    validate: {
      validator: function(v) {
        return Object.values(LANGUAGES).includes(v);
      },
      message: function(props) {
        return getMessage(props.value || DEFAULT_LANGUAGE, 'invalidLanguage');
      }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
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

// Hash PIN before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('pin')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare PIN method
userSchema.methods.comparePin = async function(candidatePin) {
  try {
    return await bcrypt.compare(candidatePin, this.pin);
  } catch (error) {
    throw error;
  }
};

// Create and export the User model
export const User = mongoose.model('User', userSchema);

