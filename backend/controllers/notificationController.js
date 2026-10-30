import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Authenticated
export const getMyNotifications = async (req, res, next) => {
  try {
    const user = req.user;

    const query = {
      $or: [
        { recipient: user._id },
        { recipient: null, targetRole: { $in: [user.role, 'all'] } },
      ],
    };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

    const formatted = notifications.map((n) => {
      const isRead =
        n.recipient && n.recipient.toString() === user._id.toString()
          ? n.isRead
          : n.readBy.some((id) => id.toString() === user._id.toString());

      return {
        _id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        createdAt: n.createdAt,
        isRead,
      };
    });

    const unreadCount = formatted.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Authenticated
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient && notification.recipient.toString() === req.user._id.toString()) {
      notification.isRead = true;
    } else {
      if (!notification.readBy.includes(req.user._id)) {
        notification.readBy.push(req.user._id);
      }
    }

    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Authenticated
export const markAllAsRead = async (req, res, next) => {
  try {
    const user = req.user;

    // Mark personal notifications
    await Notification.updateMany({ recipient: user._id }, { isRead: true });

    // Mark broadcast notifications
    await Notification.updateMany(
      {
        recipient: null,
        targetRole: { $in: [user.role, 'all'] },
        readBy: { $ne: user._id },
      },
      {
        $addToSet: { readBy: user._id },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send custom notification (TPO)
// @route   POST /api/notifications/send
// @access  Private (TPO)
export const sendTpoNotification = async (req, res, next) => {
  try {
    const { targetRole, type, title, message, link, recipient } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const notification = await Notification.create({
      recipient: recipient || null,
      targetRole: targetRole || 'student',
      type: type || 'Announcement',
      title: title.trim(),
      message: message.trim(),
      link: link || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Notification dispatched successfully',
      notification,
    });
  } catch (error) {
    next(error);
  }
};
