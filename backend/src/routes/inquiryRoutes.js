import express from 'express';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createInquiry);

// Admin routes
router.get('/', verifyAdmin, getAllInquiries);
router.get('/:id', verifyAdmin, getInquiryById);
router.put('/:id', verifyAdmin, updateInquiryStatus);
router.delete('/:id', verifyAdmin, deleteInquiry);

export default router;