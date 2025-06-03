import { Lesson } from '../models/lesson.model.js';

// Get all lessons
export const getAllLessons = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const lessons = await Lesson.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { lessons }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lessons',
      error: error.message
    });
  }
};

// Get single lesson
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: { lesson }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lesson',
      error: error.message
    });
  }
};

// Create new lesson
export const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: { lesson }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lesson',
      error: error.message
    });
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the creator or an admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: { lesson: updatedLesson }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lesson',
      error: error.message
    });
  }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the creator or an admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    await lesson.deleteOne();

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lesson',
      error: error.message
    });
  }
}; 