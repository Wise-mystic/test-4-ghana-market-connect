// import { cloudinary } from '../config/cloudinary.js';

// export const uploadToCloudinary = async (file) => {
//     try {
//         const result = await cloudinary.uploader.upload(file.path, {
//             folder: 'winsward/products',
//             resource_type: 'auto'
//         });
//         return result.secure_url;
//     } catch (error) {
//         console.error('Cloudinary upload error:', error);
//         throw new Error('Failed to upload image to Cloudinary');
//     }
// };

// export const deleteFromCloudinary = async (publicId) => {
//     try {
//         await cloudinary.uploader.destroy(publicId);
//     } catch (error) {
//         console.error('Cloudinary delete error:', error);
//         throw new Error('Failed to delete image from Cloudinary');
//     }
// };

import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export default cloudinary;