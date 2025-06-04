import request from 'supertest';
import { app } from '../app.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

describe('Product API Tests', () => {
    let authToken;
    let testProductId;
    let testUserId;

    // Create test images and test user before tests
    beforeAll(async () => {
        // Create test images directory if it doesn't exist
        const testImagesDir = path.join(process.cwd(), 'test-images');
        if (!fs.existsSync(testImagesDir)) {
            fs.mkdirSync(testImagesDir);
        }

        // Create a test image (using a real image file for Cloudinary)
        const testImagePath = path.join(testImagesDir, 'test-image.jpg');
        // Create a small valid JPEG image
        const imageBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AP/8A/9k=', 'base64');
        fs.writeFileSync(testImagePath, imageBuffer);

        // Create test user
        const testUser = await User.create({
            name: 'Test User',
            phone: '233123456789',
            pin: '123456', // Plain 6-digit PIN, will be hashed by the pre-save hook
            location: 'Test Location',
            preferredLanguage: 'en'
        });
        testUserId = testUser._id;

        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                phone: '233123456789',
                pin: '123456'
            });

        authToken = loginResponse.body.token;
    });

    // Clean up after tests
    afterAll(async () => {
        // Delete test product
        if (testProductId) {
            await Product.findByIdAndDelete(testProductId);
        }

        // Delete test user
        if (testUserId) {
            await User.findByIdAndDelete(testUserId);
        }

        // Delete test images
        const testImagesDir = path.join(process.cwd(), 'test-images');
        if (fs.existsSync(testImagesDir)) {
            fs.rmSync(testImagesDir, { recursive: true });
        }

        // Close database connection
        await mongoose.connection.close();
    });

    describe('POST /api/products', () => {
        it('should create a product with multiple images', async () => {
            const testImagePath = path.join(process.cwd(), 'test-images', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .field('name', 'Test Product')
                .field('description', 'This is a test product description')
                .field('price', '100')
                .field('category', 'vegetables')
                .field('unit', 'kg')
                .field('quantity', '10')
                .field('location', 'Test Location')
                .attach('images', testImagePath)
                .attach('images', testImagePath);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('_id');
            expect(response.body.data.images).toHaveLength(2);
            expect(response.body.data.name).toBe('Test Product');
            // Verify Cloudinary URLs
            expect(response.body.data.images[0]).toMatch(/^https:\/\/res\.cloudinary\.com\//);

            // Save product ID for cleanup
            testProductId = response.body.data._id;
        });

        it('should fail when no images are provided', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .field('name', 'Test Product')
                .field('description', 'This is a test product description')
                .field('price', '100')
                .field('category', 'vegetables')
                .field('unit', 'kg')
                .field('quantity', '10')
                .field('location', 'Test Location');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('image');
        });

        it('should fail when invalid image type is provided', async () => {
            // Create a test text file
            const testTextPath = path.join(process.cwd(), 'test-images', 'test.txt');
            fs.writeFileSync(testTextPath, 'This is not an image');

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .field('name', 'Test Product')
                .field('description', 'This is a test product description')
                .field('price', '100')
                .field('category', 'vegetables')
                .field('unit', 'kg')
                .field('quantity', '10')
                .field('location', 'Test Location')
                .attach('images', testTextPath);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('image');
        });
    });

    describe('GET /api/products/:id', () => {
        it('should get product with images', async () => {
            const response = await request(app)
                .get(`/api/products/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('images');
            expect(response.body.data.images).toHaveLength(2);
            expect(response.body.data.images[0]).toMatch(/^https:\/\/res\.cloudinary\.com\//);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('should update product with new images', async () => {
            const testImagePath = path.join(process.cwd(), 'test-images', 'test-image.jpg');

            const response = await request(app)
                .put(`/api/products/${testProductId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .field('name', 'Updated Test Product')
                .field('description', 'This is an updated test product description')
                .field('price', '150')
                .field('category', 'vegetables')
                .field('unit', 'kg')
                .field('quantity', '15')
                .field('location', 'Updated Location')
                .attach('images', testImagePath);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Updated Test Product');
            expect(response.body.data.images).toHaveLength(1);
            expect(response.body.data.images[0]).toMatch(/^https:\/\/res\.cloudinary\.com\//);
        });
    });
}); 