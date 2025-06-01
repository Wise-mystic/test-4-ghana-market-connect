import Comment from '../models/comment.model.js';
import Forum from '../models/forum.model.js';
import Notification from '../models/notification.model.js';
import { sendNotification, NotificationType } from '../services/socket.service.js';

// Add comment to forum post
export const addComment = async (req, res) => {
  try {
    const { forumId } = req.params;
    const { content } = req.body;

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      forum: forumId
    });

    // Populate author details
    await comment.populate('author', 'name role');

    // Create notification for forum author
    if (forum.author.toString() !== req.user.id) {
      const notification = await Notification.create({
        user: forum.author,
        type: NotificationType.NEW_COMMENT,
        data: {
          commentId: comment._id,
          forumId: forum._id,
          forumTitle: forum.title,
          commentAuthor: req.user.name
        }
      });

      // Send real-time notification
      sendNotification(forum.author, NotificationType.NEW_COMMENT, {
        commentId: comment._id,
        forumId: forum._id,
        forumTitle: forum.title,
        commentAuthor: req.user.name
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Edit comment
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author or an admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this comment'
      });
    }

    comment.content = content;
    await comment.save();

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author or an admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

// Get comments for a forum post
export const getForumComments = async (req, res) => {
  try {
    const { forumId } = req.params;
    const comments = await Comment.find({ forum: forumId })
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
}; 