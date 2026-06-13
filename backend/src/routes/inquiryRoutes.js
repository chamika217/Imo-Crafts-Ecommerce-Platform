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
// chore: update 2 - 2026-06-12T03:02:22

// chore: update 25 - 2026-06-10T14:56:57

// chore: update 110 - 2026-06-14T04:19:49
