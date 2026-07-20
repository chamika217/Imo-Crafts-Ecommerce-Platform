import express from 'express';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createInquiry);

// staff + customerSupport
router.get('/', verifyAdmin, requireRole('staff', 'customerSupport'), getAllInquiries);
router.get('/:id', verifyAdmin, requireRole('staff', 'customerSupport'), getInquiryById);
router.put('/:id', verifyAdmin, requireRole('staff', 'customerSupport'), updateInquiryStatus);
router.delete('/:id', verifyAdmin, requireRole('superAdmin'), deleteInquiry);

export default router;
