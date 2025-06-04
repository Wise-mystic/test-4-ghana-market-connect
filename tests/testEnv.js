import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { jest } from '@jest/globals';

dotenv.config();

// Configure Cloudinary for testing
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Mock Cloudinary upload for testing
cloudinary.uploader.upload = jest.fn().mockImplementation((file) => {
    return Promise.resolve({
        secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
        public_id: 'test'
    });
});

export { cloudinary }; 