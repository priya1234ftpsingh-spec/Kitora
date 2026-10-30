import express from 'express';
import {
  applyToDrive,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent, isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student routes
router.post('/apply/:driveId', protect, isStudent, applyToDrive);
router.post('/', protect, isStudent, applyToDrive);
router.get('/my', protect, isStudent, getMyApplications);

// TPO routes
router.get('/', protect, isTPO, getAllApplications);
router.put('/:id/status', protect, isTPO, updateApplicationStatus);

export default router;
