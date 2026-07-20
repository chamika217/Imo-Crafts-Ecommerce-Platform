import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// staff + orderManager + customerSupport
router.get('/', verifyAdmin, requireRole('staff', 'orderManager', 'customerSupport'), getAllCustomers);
router.get('/:id', verifyAdmin, requireRole('staff', 'orderManager', 'customerSupport'), getCustomerById);
router.put('/:id', verifyAdmin, requireRole('staff', 'orderManager'), updateCustomer);
router.delete('/:id', verifyAdmin, requireRole('superAdmin'), deleteCustomer);

export default router;
