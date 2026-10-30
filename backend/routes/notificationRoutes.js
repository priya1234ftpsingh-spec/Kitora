import express from 'express';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  sendTpoNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markNotificationAsRead);
router.put('/read-all', protect, markAllAsRead);

// TPO route to dispatch custom notifications
router.post('/send', protect, isTPO, sendTpoNotification);

export default router;
