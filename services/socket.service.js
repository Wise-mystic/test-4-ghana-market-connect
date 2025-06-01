import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);

    // Join user's personal room for notifications
    socket.join(`user:${socket.user.id}`);

    // Join admin room if user is admin
    if (socket.user.role === 'admin') {
      socket.join('admin');
    }

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.id);
    });
  });

  return io;
};

// Notification types
export const NotificationType = {
  NEW_COMMENT: 'new_comment',
  NEW_REPORT: 'new_report',
  PRODUCT_SOLD: 'product_sold',
  LESSON_PUBLISHED: 'lesson_published'
};

// Send notification to specific user
export const sendNotification = (userId, type, data) => {
  if (!io) return;
  
  io.to(`user:${userId}`).emit('notification', {
    type,
    data,
    timestamp: new Date()
  });
};

// Send notification to all admins
export const sendAdminNotification = (type, data) => {
  if (!io) return;
  
  io.to('admin').emit('admin_notification', {
    type,
    data,
    timestamp: new Date()
  });
};

// Broadcast event to all connected clients
export const broadcastEvent = (event, data) => {
  if (!io) return;
  
  io.emit(event, {
    ...data,
    timestamp: new Date()
  });
}; 