import express from 'express';
import {
  getMyDocuments,
  uploadDocument,
  deleteMyDocument,
  getAllDocuments,
  verifyDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent, isTPO } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Student routes
router.get('/my', protect, isStudent, getMyDocuments);
router.post('/upload', protect, isStudent, upload.single('file'), uploadDocument);
router.delete('/:id', protect, isStudent, deleteMyDocument);

// TPO routes
router.get('/', protect, isTPO, getAllDocuments);
router.put('/:id/verify', protect, isTPO, verifyDocument);

export default router;
