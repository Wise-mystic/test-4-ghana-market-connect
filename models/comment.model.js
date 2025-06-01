//To handle comments on the forum
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String
}, { timestamps: true });

commentSchema.plugin(normalize);
export default mongoose.model('Comment', commentSchema);