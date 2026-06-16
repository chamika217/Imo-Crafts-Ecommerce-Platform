import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// staff + superAdmin can view customers
router.get('/', verifyAdmin, requireRole('staff'), getAllCustomers);
router.get('/:id', verifyAdmin, requireRole('staff'), getCustomerById);
router.put('/:id', verifyAdmin, requireRole('staff'), updateCustomer);
router.delete('/:id', verifyAdmin, requireRole('superAdmin'), deleteCustomer);

export default router;
