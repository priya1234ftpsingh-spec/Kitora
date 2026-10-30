import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means broadcast to role or all
    },
    targetRole: {
      type: String,
      enum: ['student', 'tpo', 'all'],
      default: 'student',
    },
    type: {
      type: String,
      enum: [
        'Placement',
        'Deadline',
        'Interview',
        'Training',
        'Seminar',
        'Document',
        'Result',
        'Announcement',
        'System',
      ],
      default: 'Placement',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
