import express from 'express';
import {
  analyzeResumeHandler,
  analyzeSkillGapHandler,
  getDriveMatchHandler,
  getCareerRecommendationsHandler,
  chatAssistantHandler,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isStudent } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/resume-analysis', protect, isStudent, analyzeResumeHandler);
router.post('/skill-gap', protect, isStudent, analyzeSkillGapHandler);
router.get('/drive-match/:driveId', protect, isStudent, getDriveMatchHandler);
router.get('/career-recommendations', protect, isStudent, getCareerRecommendationsHandler);
router.post('/chat', protect, isStudent, chatAssistantHandler);

export default router;
