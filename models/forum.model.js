//Forum post schema for discussions.
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const forumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'farming', 'marketing', 'logistics', 'health'],
    default: 'general'
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  isClosed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

forumSchema.plugin(normalize);

export const Forum = mongoose.model('Forum', forumSchema);

