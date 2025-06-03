import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const locations = {
    'Accra': ['Madina', 'Tema', 'East Legon', 'Dansoman', 'Osu'],
    'Kumasi': ['Adum', 'Suame', 'Asokwa', 'Ayigya', 'Bantama'],
    'Tamale': ['Lamashegu', 'Sagnarigu', 'Nyohini', 'Sabonjida'],
    'Cape Coast': ['Kotokuraba', 'Pedu', 'Abura', 'Elmina']
};

const languages = ['en', 'tw', 'ha'];

const generatePhoneNumber = (index) => {
    return `233200000${index.toString().padStart(3, '0')}`;
};

const generateDummyUsers = () => {
    const users = [];

    // Generate 10 Farmers
    for (let i = 1; i <= 10; i++) {
        const city = Object.keys(locations)[Math.floor(Math.random() * Object.keys(locations).length)];
        const area = locations[city][Math.floor(Math.random() * locations[city].length)];
        
        users.push({
            name: `Farmer ${i}`,
            phone: generatePhoneNumber(i),
            pin: '123456',
            role: 'farmer',
            location: `${area}, ${city}`,
            preferredLanguage: languages[Math.floor(Math.random() * languages.length)],
            isVerified: true
        });
    }

    // Generate 10 Market Women
    for (let i = 11; i <= 20; i++) {
        const city = Object.keys(locations)[Math.floor(Math.random() * Object.keys(locations).length)];
        const area = locations[city][Math.floor(Math.random() * locations[city].length)];
        
        users.push({
            name: `Market Woman ${i-10}`,
            phone: generatePhoneNumber(i),
            pin: '123456',
            role: 'market_woman',
            location: `${area} Market, ${city}`,
            preferredLanguage: languages[Math.floor(Math.random() * languages.length)],
            isVerified: true
        });
    }

    // Generate 2 Admins
    for (let i = 21; i <= 22; i++) {
        users.push({
            name: `Admin ${i-20}`,
            phone: generatePhoneNumber(i),
            pin: '123456',
            role: 'admin',
            location: 'Accra Headquarters',
            preferredLanguage: 'en',
            isVerified: true
        });
    }

    // Generate 5 Logistics
    for (let i = 23; i <= 27; i++) {
        const city = Object.keys(locations)[Math.floor(Math.random() * Object.keys(locations).length)];
        users.push({
            name: `Logistics Driver ${i-22}`,
            phone: generatePhoneNumber(i),
            pin: '123456',
            role: 'logistics',
            location: `${city} Hub`,
            preferredLanguage: languages[Math.floor(Math.random() * languages.length)],
            isVerified: true
        });
    }

    return users;
};

async function seedUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Generate and insert dummy users
        const users = generateDummyUsers();
        const createdUsers = await User.insertMany(users);

        // Log created users by role
        const usersByRole = createdUsers.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});

        console.log('\nCreated users by role:');
        Object.entries(usersByRole).forEach(([role, count]) => {
            console.log(`${role}: ${count} users`);
        });

        console.log('\nUser details:');
        createdUsers.forEach(user => {
            console.log(`\n${user.name}:`);
            console.log(`- Phone: ${user.phone}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Location: ${user.location}`);
            console.log(`- Language: ${user.preferredLanguage}`);
        });

        console.log('\nAll users created successfully!');
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

seedUsers(); 