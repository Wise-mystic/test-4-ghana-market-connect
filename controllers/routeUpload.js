import express from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { upload } from '../utils/imageUpload.js';

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        
        res.status(200).json({
            success: true,
            message: 'Uploaded successfully!',
            data: result
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

export default router;