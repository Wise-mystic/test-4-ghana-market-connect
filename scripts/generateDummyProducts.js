import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const products = {
    vegetables: [
        { name: 'Tomatoes', unit: 'kg', priceRange: { min: 5, max: 8 } },
        { name: 'Onions', unit: 'kg', priceRange: { min: 4, max: 7 } },
        { name: 'Green Pepper', unit: 'kg', priceRange: { min: 6, max: 10 } },
        { name: 'Cabbage', unit: 'piece', priceRange: { min: 3, max: 5 } },
        { name: 'Carrots', unit: 'kg', priceRange: { min: 4, max: 7 } },
        { name: 'Lettuce', unit: 'piece', priceRange: { min: 2, max: 4 } },
        { name: 'Cucumber', unit: 'piece', priceRange: { min: 1, max: 2 } },
        { name: 'Eggplant', unit: 'kg', priceRange: { min: 3, max: 6 } }
    ],
    fruits: [
        { name: 'Mangoes', unit: 'kg', priceRange: { min: 3, max: 5 } },
        { name: 'Oranges', unit: 'kg', priceRange: { min: 4, max: 7 } },
        { name: 'Pineapples', unit: 'piece', priceRange: { min: 5, max: 8 } },
        { name: 'Watermelon', unit: 'piece', priceRange: { min: 10, max: 15 } },
        { name: 'Bananas', unit: 'bundle', priceRange: { min: 5, max: 8 } },
        { name: 'Pawpaw', unit: 'piece', priceRange: { min: 8, max: 12 } }
    ],
    tubers: [
        { name: 'Yam', unit: 'kg', priceRange: { min: 8, max: 12 } },
        { name: 'Cassava', unit: 'kg', priceRange: { min: 3, max: 5 } },
        { name: 'Sweet Potato', unit: 'kg', priceRange: { min: 4, max: 6 } },
        { name: 'Cocoyam', unit: 'kg', priceRange: { min: 5, max: 8 } }
    ],
    grains: [
        { name: 'Maize', unit: 'bag', priceRange: { min: 150, max: 200 } },
        { name: 'Rice', unit: 'bag', priceRange: { min: 200, max: 250 } },
        { name: 'Millet', unit: 'bag', priceRange: { min: 120, max: 180 } },
        { name: 'Sorghum', unit: 'bag', priceRange: { min: 130, max: 190 } }
    ],
    legumes: [
        { name: 'Beans', unit: 'kg', priceRange: { min: 8, max: 12 } },
        { name: 'Groundnuts', unit: 'kg', priceRange: { min: 10, max: 15 } },
        { name: 'Soybeans', unit: 'kg', priceRange: { min: 7, max: 11 } },
        { name: 'Cowpeas', unit: 'kg', priceRange: { min: 6, max: 10 } }
    ],
    spices: [
        { name: 'Ginger', unit: 'kg', priceRange: { min: 15, max: 20 } },
        { name: 'Garlic', unit: 'kg', priceRange: { min: 20, max: 25 } },
        { name: 'Turmeric', unit: 'kg', priceRange: { min: 18, max: 23 } }
    ],
    herbs: [
        { name: 'Basil', unit: 'bundle', priceRange: { min: 2, max: 4 } },
        { name: 'Mint', unit: 'bundle', priceRange: { min: 2, max: 4 } },
        { name: 'Parsley', unit: 'bundle', priceRange: { min: 2, max: 4 } }
    ]
};

const generateRandomPrice = (range) => {
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

const generateRandomQuantity = (unit) => {
    switch (unit) {
        case 'kg':
            return Math.floor(Math.random() * 50) + 10; // 10-60 kg
        case 'g':
            return Math.floor(Math.random() * 1000) + 500; // 500-1500g
        case 'piece':
            return Math.floor(Math.random() * 20) + 5; // 5-25 pieces
        case 'bundle':
            return Math.floor(Math.random() * 10) + 2; // 2-12 bundles
        case 'bag':
            return Math.floor(Math.random() * 5) + 1; // 1-6 bags
        default:
            return Math.floor(Math.random() * 10) + 1;
    }
};

const generateDummyProducts = async (farmers) => {
    const dummyProducts = [];
    const descriptions = [
        'Fresh and organic produce',
        'Locally grown and harvested',
        'High quality and fresh',
        'Direct from the farm',
        'Premium quality produce'
    ];

    for (const farmer of farmers) {
        // Each farmer will have 2-4 products
        const numProducts = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numProducts; i++) {
            // Randomly select a category
            const category = Object.keys(products)[Math.floor(Math.random() * Object.keys(products).length)];
            const categoryProducts = products[category];
            
            // Randomly select a product from the category
            const productTemplate = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
            
            const product = {
                name: productTemplate.name,
                category: category,
                unit: productTemplate.unit,
                price: generateRandomPrice(productTemplate.priceRange),
                quantity: generateRandomQuantity(productTemplate.unit),
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                seller: farmer._id,
                location: farmer.location,
                isAvailable: true
            };
            
            dummyProducts.push(product);
        }
    }

    return dummyProducts;
};

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all farmers
        const farmers = await User.find({ role: 'farmer' });
        console.log(`Found ${farmers.length} farmers`);

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Generate and insert dummy products
        const products = await generateDummyProducts(farmers);
        const createdProducts = await Product.insertMany(products);

        // Log created products by category
        const productsByCategory = createdProducts.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        console.log('\nCreated products by category:');
        Object.entries(productsByCategory).forEach(([category, count]) => {
            console.log(`${category}: ${count} products`);
        });

        console.log('\nProduct details:');
        createdProducts.forEach(product => {
            console.log(`\n${product.name}:`);
            console.log(`- Category: ${product.category}`);
            console.log(`- Price: GHS ${product.price}/${product.unit}`);
            console.log(`- Quantity: ${product.quantity} ${product.unit}`);
            console.log(`- Location: ${product.location}`);
        });

        console.log('\nAll products created successfully!');
    } catch (error) {
        console.error('Error creating products:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

seedProducts(); 