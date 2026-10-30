import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getStudentDashboardStats,
  getAllStudents,
  getStudentById,
  updateStudentPlacementStatus,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent, isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student-specific routes
router.get('/profile', protect, isStudent, getMyProfile);
router.put('/profile', protect, isStudent, updateMyProfile);
router.get('/dashboard-stats', protect, isStudent, getStudentDashboardStats);

// TPO-specific routes
router.get('/', protect, isTPO, getAllStudents);
router.get('/:id', protect, isTPO, getStudentById);
router.put('/:id/status', protect, isTPO, updateStudentPlacementStatus);

export default router;
