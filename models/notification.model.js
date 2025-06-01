import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['new_comment', 'new_report', 'product_sold', 'lesson_published']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 