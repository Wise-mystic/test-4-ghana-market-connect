import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './services/socket.service.js';
import { connectDB } from './config/index.js';
import { languageMiddleware } from './middlewares/language.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import productRoutes from './routes/product.routes.js';
import forumRoutes from './routes/forum.routes.js';
import commentRoutes from './routes/comment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import otpRoutes from './routes/otpRoutes.js';
import resetPinRoutes from './routes/resetPinRoutes.js';
import routeUpload from './controllers/routeUpload.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(languageMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', routeUpload);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app }; 