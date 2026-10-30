import express from 'express';
import {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
} from '../controllers/driveController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllDrives);
router.get('/:id', protect, getDriveById);

// TPO only routes
router.post('/', protect, isTPO, createDrive);
router.put('/:id', protect, isTPO, updateDrive);
router.delete('/:id', protect, isTPO, deleteDrive);

export default router;
