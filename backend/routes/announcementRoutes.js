import express from 'express';
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllAnnouncements);

// TPO routes
router.post('/', protect, isTPO, createAnnouncement);
router.put('/:id', protect, isTPO, updateAnnouncement);
router.delete('/:id', protect, isTPO, deleteAnnouncement);

export default router;
