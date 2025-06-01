import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Server Configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};

// Database Configuration
export const DB_CONFIG = {
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/winsward',
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  }
};

// JWT Configuration
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  EXPIRE: process.env.JWT_EXPIRE || '30d',
  COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE) || 30
};

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  API_KEY: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  API_SECRET: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
};

// SMS Configuration
export const SMS_CONFIG = {
  ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 'your_account_sid',
  AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || 'your_auth_token',
  PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || 'your_phone_number'
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(',')
};

// Security Configuration
export const SECURITY_CONFIG = {
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Logging Configuration
export const LOG_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'debug',
  FILE_PATH: process.env.LOG_FILE_PATH || 'logs/app.log'
};

// Cache Configuration
export const CACHE_CONFIG = {
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  TTL: parseInt(process.env.CACHE_TTL) || 3600
};

// Admin Configuration
export const ADMIN_CONFIG = {
  EMAIL: process.env.ADMIN_EMAIL || 'admin@winsward.com',
  PHONE: process.env.ADMIN_PHONE || '233123456789'
};

// Only validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
} 