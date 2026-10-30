import express from 'express';
import {
  getAllEvents,
  getEventById,
  registerForEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent, isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllEvents);
router.get('/:id', protect, getEventById);
router.post('/:id/register', protect, isStudent, registerForEvent);

// TPO routes
router.post('/', protect, isTPO, createEvent);
router.put('/:id', protect, isTPO, updateEvent);
router.delete('/:id', protect, isTPO, deleteEvent);

export default router;
