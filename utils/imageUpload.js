import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'winsward/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        resource_type: 'auto'
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    console.log('>>> Entering fileFilter');
    console.log('Processing file:', file.originalname);
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        console.log('File rejected: Invalid format');
        return cb(new Error('Only image files are allowed!'), false);
    }
    console.log('File accepted:', file.originalname);
    console.log('<<< Exiting fileFilter');
    cb(null, true);
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    console.log('=== Multer error handler called ===');
    console.log('Multer error:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    console.log('No Multer error, proceeding...');
    next();
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Export both the multer instance and error handler
export { upload, handleMulterError }; 

