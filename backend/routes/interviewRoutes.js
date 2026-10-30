import express from 'express';
import {
  getMyInterviews,
  getAllInterviews,
  scheduleInterview,
  updateInterview,
  deleteInterview,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent, isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student routes
router.get('/my', protect, isStudent, getMyInterviews);

// TPO routes
router.get('/', protect, isTPO, getAllInterviews);
router.post('/', protect, isTPO, scheduleInterview);
router.put('/:id', protect, isTPO, updateInterview);
router.delete('/:id', protect, isTPO, deleteInterview);

export default router;
