import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from './env.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: CLOUDINARY_CONFIG.API_KEY,
  api_secret: CLOUDINARY_CONFIG.API_SECRET
});

// Only import multer and storage if we're not in development mode
let upload, deleteFile, getFileUrl, uploadFile;

if (process.env.NODE_ENV !== 'development') {
  const { CloudinaryStorage } = await import('multer-storage-cloudinary');
  const multer = await import('multer');

  // Configure storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'winsward',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      resource_type: 'auto'
    }
  });

  // Create multer upload instance
  upload = multer.default({ storage: storage });

  // Helper function to delete file from Cloudinary
  deleteFile = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  };

  // Helper function to get file URL
  getFileUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
      secure: true,
      ...options
    });
  };

  // Helper function to upload file directly (without multer)
  uploadFile = async (file, options = {}) => {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'winsward',
        ...options
      });
      return result;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw error;
    }
  };
} else {
  // Mock functions for development
  upload = (req, res, next) => next();
  deleteFile = async () => ({ result: 'ok' });
  getFileUrl = () => 'https://example.com/mock-image.jpg';
  uploadFile = async () => ({ url: 'https://example.com/mock-image.jpg' });
}

export {
  cloudinary,
  upload,
  deleteFile,
  getFileUrl,
  uploadFile
}; 