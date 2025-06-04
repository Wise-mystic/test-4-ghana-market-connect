import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to test database
beforeAll(async () => {
    try {
        // Use a separate test database
        const testMongoUri = process.env.MONGO_URI.replace(
            /\/[^/]+$/,
            '/winsward_test'
        );
        
        await mongoose.connect(testMongoUri);
        console.log('Connected to test database');
    } catch (error) {
        console.error('Error connecting to test database:', error);
        process.exit(1);
    }
});

// Clear all collections after each test
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

// Close database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
    console.log('Disconnected from test database');
}); 