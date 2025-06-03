import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const users = [
    {
        name: 'Market Woman 1',
        phone: '233200000001',
        pin: '123456',
        role: 'market_woman',
        location: 'Accra Market',
        preferredLanguage: 'en',
        isVerified: true
    },
    {
        name: 'Logistics Driver 1',
        phone: '233200000002',
        pin: '123456',
        role: 'logistics',
        location: 'Accra',
        preferredLanguage: 'en',
        isVerified: true
    },
    {
        name: 'Admin User',
        phone: '233200000003',
        pin: '123456',
        role: 'admin',
        location: 'Accra',
        preferredLanguage: 'en',
        isVerified: true
    },
    {
        name: 'Farmer 1',
        phone: '233200000004',
        pin: '123456',
        role: 'farmer',
        location: 'Kumasi',
        preferredLanguage: 'ha',
        isVerified: true
    }
];

async function createUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create new users
        const createdUsers = await User.insertMany(users);
        console.log('Created users:', createdUsers.map(user => ({
            name: user.name,
            role: user.role,
            phone: user.phone
        })));

        console.log('Users created successfully');
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createUsers(); 