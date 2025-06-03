import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from './env.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: CLOUDINARY_CONFIG.API_KEY,
  api_secret: CLOUDINARY_CONFIG.API_SECRET
});

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
const upload = multer({ storage: storage });

// Helper function to delete file from Cloudinary
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get file URL
const getFileUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options
  });
};

// Helper function to upload file directly (without multer)
const uploadFile = async (file, options = {}) => {
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

export {
  cloudinary,
  upload,
  deleteFile,
  getFileUrl,
  uploadFile
}; 