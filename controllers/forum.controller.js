import Forum from '../models/forum.model.js';
import Notification from '../models/notification.model.js';
import { sendAdminNotification, NotificationType } from '../services/socket.service.js';

// Get all forum posts
export const getAllForums = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category) query.category = category;

    const forums = await Forum.find(query)
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { forums }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forum posts',
      error: error.message
    });
  }
};

// Get single forum post
export const getForumById = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate('author', 'name role')
      .populate('likes', 'name');

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    res.json({
      success: true,
      data: { forum }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forum post',
      error: error.message
    });
  }
};

// Create new forum post
export const createForum = async (req, res) => {
  try {
    const forum = await Forum.create({
      ...req.body,
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Forum post created successfully',
      data: { forum }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating forum post',
      error: error.message
    });
  }
};

// Update forum post
export const updateForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    // Check if user is the author or an admin
    if (forum.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const updatedForum = await Forum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name role');

    res.json({
      success: true,
      message: 'Forum post updated successfully',
      data: { forum: updatedForum }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating forum post',
      error: error.message
    });
  }
};

// Delete forum post
export const deleteForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    // Check if user is the author or an admin
    if (forum.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await forum.deleteOne();

    res.json({
      success: true,
      message: 'Forum post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting forum post',
      error: error.message
    });
  }
};

// Like/Unlike forum post
export const toggleLike = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    const likeIndex = forum.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      // Like the post
      forum.likes.push(req.user.id);
    } else {
      // Unlike the post
      forum.likes.splice(likeIndex, 1);
    }

    await forum.save();

    res.json({
      success: true,
      message: likeIndex === -1 ? 'Post liked' : 'Post unliked',
      data: { likes: forum.likes.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
};

// Report forum post
export const reportForum = async (req, res) => {
  try {
    const { reason } = req.body;
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    forum.isReported = true;
    forum.reportReason = reason;
    await forum.save();

    // Create notification for admins
    const notification = await Notification.create({
      user: 'admin', // Special user ID for admin notifications
      type: NotificationType.NEW_REPORT,
      data: {
        forumId: forum._id,
        forumTitle: forum.title,
        reportReason: reason,
        reportedBy: req.user.name
      }
    });

    // Send real-time notification to all admins
    sendAdminNotification(NotificationType.NEW_REPORT, {
      forumId: forum._id,
      forumTitle: forum.title,
      reportReason: reason,
      reportedBy: req.user.name
    });

    res.json({
      success: true,
      message: 'Post reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reporting post',
      error: error.message
    });
  }
}; 