//user schema with role management
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^233\d{9}$/.test(v); // Ghana phone number format
      },
      message: props => `${props.value} is not a valid Ghana phone number!`
    }
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['farmer', 'market_woman', 'admin'] 
  },
  location: { type: String, required: true },
  preferredLanguage: { 
    type: String, 
    required: true, 
    enum: ['en', 'tw', 'ga', 'ewe'] 
  },
  pin: { 
    type: String, 
    required: true
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Hash PIN before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('pin')) return next();
    
    // Only validate PIN format if it's not already hashed
    if (!this.pin.startsWith('$2')) {
      if (!/^\d{6}$/.test(this.pin)) {
        return next(new Error('PIN must be 6 digits'));
      }
      this.pin = await bcrypt.hash(this.pin, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Compare PIN method
userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

userSchema.plugin(normalize);
export default mongoose.model('User', userSchema);

