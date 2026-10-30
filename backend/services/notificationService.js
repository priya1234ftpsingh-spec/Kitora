import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipient = null,
  targetRole = 'student',
  type = 'Placement',
  title,
  message,
  link = '',
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      targetRole,
      type,
      title,
      message,
      link,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

export const notifyStudent = async (userId, { type, title, message, link }) => {
  return await createNotification({
    recipient: userId,
    targetRole: 'student',
    type,
    title,
    message,
    link,
  });
};

export const notifyAllStudents = async ({ type, title, message, link }) => {
  return await createNotification({
    recipient: null,
    targetRole: 'student',
    type,
    title,
    message,
    link,
  });
};

export const notifyTPO = async ({ type, title, message, link }) => {
  return await createNotification({
    recipient: null,
    targetRole: 'tpo',
    type,
    title,
    message,
    link,
  });
};
