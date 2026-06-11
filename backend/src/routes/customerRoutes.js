import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/', verifyAdmin, getAllCustomers);
router.get('/:id', verifyAdmin, getCustomerById);
router.put('/:id', verifyAdmin, updateCustomer);
router.delete('/:id', verifyAdmin, deleteCustomer);

export default router;
// chore: update 27 - 2026-06-11T16:49:20
