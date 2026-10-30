import Announcement from '../models/Announcement.js';
import { notifyAllStudents } from '../services/notificationService.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public / Authenticated
export const getAllAnnouncements = async (req, res, next) => {
  try {
    const { category = '', priority = '' } = req.query;
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name')
      .sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement (TPO)
// @route   POST /api/announcements
// @access  Private (TPO)
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, category, priority, targetAudience } = req.body;
    const msg = req.body.message || req.body.content;

    if (!title || !msg) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      message: msg.trim(),
      category: category || 'General',
      priority: priority || 'Medium',
      targetAudience: targetAudience || 'All Students',
      isPublished: true,
      createdBy: req.user._id,
    });

    // Notify all students
    await notifyAllStudents({
      type: 'Announcement',
      title: `Notice: ${announcement.title}`,
      message: announcement.message,
      link: '/student/dashboard',
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement (TPO)
// @route   PUT /api/announcements/:id
// @access  Private (TPO)
export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement (TPO)
// @route   DELETE /api/announcements/:id
// @access  Private (TPO)
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
