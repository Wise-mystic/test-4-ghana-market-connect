import { Comment } from '../models/comment.model.js';
import { Forum } from '../models/forum.model.js';
import { Notification } from '../models/notification.model.js';
import { sendNotification, NotificationType } from '../services/socket.service.js';

// Get comments for a forum post
export const getComments = async (req, res) => {
  try {
    const { forumId } = req.params;
    const comments = await Comment.find({ forum: forumId })
      .populate('author', 'name role')
      .populate('parentComment')
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

// Create comment
export const createComment = async (req, res) => {
  try {
    const { forumId, parentCommentId } = req.body;
    const { content } = req.body;

    // Check if forum exists
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    // If this is a reply, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      forum: forumId,
      parentComment: parentCommentId
    });

    // Populate author details
    await comment.populate('author', 'name role');

    // Create notification for forum author if comment is not from the author
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
      message: 'Comment created successfully',
      data: { comment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
};

// Update comment
export const updateComment = async (req, res) => {
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

// Like comment
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user already liked the comment
    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this comment'
      });
    }

    // Add user to likes array
    comment.likes.push(req.user.id);
    await comment.save();

    res.json({
      success: true,
      message: 'Comment liked successfully',
      data: { likes: comment.likes.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking comment',
      error: error.message
    });
  }
};

// Unlike comment
export const unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user has liked the comment
    const likeIndex = comment.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this comment'
      });
    }

    // Remove user from likes array
    comment.likes.splice(likeIndex, 1);
    await comment.save();

    res.json({
      success: true,
      message: 'Comment unliked successfully',
      data: { likes: comment.likes.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unliking comment',
      error: error.message
    });
  }
};

// Report comment
export const reportComment = async (req, res) => {
  try {
    const { reason } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.isReported = true;
    comment.reportReason = reason;
    await comment.save();

    // Create notification for admins
    const notification = await Notification.create({
      user: 'admin', // Special user ID for admin notifications
      type: NotificationType.NEW_REPORT,
      data: {
        commentId: comment._id,
        forumId: comment.forum,
        commentContent: comment.content,
        reportReason: reason,
        reportedBy: req.user.name
      }
    });

    // Send real-time notification to all admins
    sendNotification('admin', NotificationType.NEW_REPORT, {
      commentId: comment._id,
      forumId: comment.forum,
      commentContent: comment.content,
      reportReason: reason,
      reportedBy: req.user.name
    });

    res.json({
      success: true,
      message: 'Comment reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reporting comment',
      error: error.message
    });
  }
}; 