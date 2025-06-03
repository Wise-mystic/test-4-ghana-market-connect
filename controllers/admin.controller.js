import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Forum } from '../models/forum.model.js';
import { Lesson } from '../models/lesson.model.js';
import { generateOTP } from '../utils/otp.js';
import { sendVerificationSMS } from '../services/email.service.js';

// Get dashboard overview
export const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalForums,
      totalLessons,
      reportedForums,
      userStats
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Forum.countDocuments(),
      Lesson.countDocuments(),
      Forum.find({ isReported: true }).count(),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalForums,
        totalLessons,
        reportedForums,
        userStats: userStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: error.message
    });
  }
};

// Get reported content
export const getReportedContent = async (req, res) => {
  try {
    const reportedForums = await Forum.find({ isReported: true })
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reportedForums }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reported content',
      error: error.message
    });
  }
};

// Handle reported content
export const handleReportedContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const forum = await Forum.findById(id);
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum post not found'
      });
    }

    if (!forum.isReported) {
      return res.status(400).json({
        success: false,
        message: 'This post is not reported'
      });
    }

    switch (action) {
      case 'dismiss':
        forum.isReported = false;
        forum.reportReason = undefined;
        await forum.save();
        break;

      case 'delete':
        await forum.deleteOne();
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Report ${action}ed successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error handling reported content',
      error: error.message
    });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, phone, location, preferredLanguage, pin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Generate verification code
    const verificationCode = generateOTP();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new admin user
    const admin = new User({
      name,
      phone,
      role: 'admin',
      location,
      preferredLanguage,
      pin,
      verificationToken: verificationCode,
      verificationTokenExpires: verificationExpires,
      isVerified: false
    });

    await admin.save();

    // Send verification SMS
    await sendVerificationSMS(admin.phone, verificationCode);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully. Please verify your account with the code sent to your phone.',
      data: {
        userId: admin._id
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error registering admin', 
      error: error.message 
    });
  }
};

export const verifyAdmin = async (req, res) => {
  try {
    const { phone, code } = req.body;

    const admin = await User.findOne({
      phone,
      verificationToken: code,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification code' 
      });
    }

    admin.isVerified = true;
    admin.verificationToken = undefined;
    admin.verificationTokenExpires = undefined;
    await admin.save();

    res.status(200).json({ 
      success: true,
      message: 'Admin account verified successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error verifying admin account', 
      error: error.message 
    });
  }
}; 