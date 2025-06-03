// Schema for multilingual educational content.

import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true
  },
  description: {
    type: Map,
    of: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Business', 'Farming', 'Health'],
    required: true
  },
  content: {
    type: Map,
    of: {
      audioUrl: String,
      videoUrl: String,
      text: String,
      images: [String]
    },
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

lessonSchema.plugin(normalize);

export const Lesson = mongoose.model('Lesson', lessonSchema);




