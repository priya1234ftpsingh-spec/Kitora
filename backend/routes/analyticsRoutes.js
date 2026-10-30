import express from 'express';
import {
  getDashboardAnalytics,
  getReportsData,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, isTPO, getDashboardAnalytics);
router.get('/reports', protect, isTPO, getReportsData);

export default router;
