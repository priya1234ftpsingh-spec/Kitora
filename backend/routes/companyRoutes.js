import express from 'express';
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTPO } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

// TPO only routes
router.post('/', protect, isTPO, createCompany);
router.put('/:id', protect, isTPO, updateCompany);
router.delete('/:id', protect, isTPO, deleteCompany);

export default router;
