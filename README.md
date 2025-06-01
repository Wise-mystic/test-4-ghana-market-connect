# Winsward Backend API

A high-performance, secure, and scalable RESTful API built with Express.js, Socket.io, and MongoDB. This API serves a mobile-friendly web application targeted at users with limited digital literacy, enabling simple registration (name, phone, PIN), secure login, and password (PIN) recovery via OTP sent to their phones.

## Features

- User Authentication (Phone + PIN)
- OTP-based PIN Recovery
- Real-time Notifications
- Role-based Access Control
- Multilingual Support
- Forum Discussions
- Product Listings
- Learning Modules

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd winsward
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/winsward
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Log in a user
- GET /api/auth/me - Get current user profile
- POST /api/auth/request-otp - Request OTP for PIN reset
- POST /api/auth/verify-otp - Verify OTP
- POST /api/auth/reset-pin - Reset PIN with OTP

### User Management
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user profile
- DELETE /api/users/:id - Delete user
- GET /api/users/role/:role - Get users by role
- GET /api/users - Get all users

### Learning Modules
- GET /api/lessons - Get all learning modules
- GET /api/lessons/:id - Get single lesson
- POST /api/lessons - Create a new lesson
- PUT /api/lessons/:id - Update a lesson
- DELETE /api/lessons/:id - Delete a lesson

### Product Listings
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create a product listing
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product
- GET /api/products/user/:id - Get all products by a user

### Forum Discussions
- GET /api/forums - Get all forum posts
- GET /api/forums/:id - Get forum post by ID
- POST /api/forums - Create a new forum post
- PUT /api/forums/:id - Update forum post
- DELETE /api/forums/:id - Delete forum post

### Comments
- POST /api/forums/:forumId/comments - Add comment to forum post
- PUT /api/comments/:id - Edit comment
- DELETE /api/comments/:id - Delete comment

## Security Features

- JWT-based authentication
- PIN hashing with bcrypt
- Input validation using Joi
- CORS configuration
- Rate limiting for OTP requests
- Secure error handling

## Real-time Features

- Socket.io integration for real-time updates
- Chat functionality
- Notifications
- Live forum updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 