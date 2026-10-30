import express from 'express';
import {
  getAllTrainings,
  getTrainingById,
  enrollInTraining,
  createTraining,
  updateTraining,
  deleteTraining,
} from '../controllers/trainingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent, isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllTrainings);
router.get('/:id', protect, getTrainingById);
router.post('/:id/enroll', protect, isStudent, enrollInTraining);

// TPO routes
router.post('/', protect, isTPO, createTraining);
router.put('/:id', protect, isTPO, updateTraining);
router.delete('/:id', protect, isTPO, deleteTraining);

export default router;
