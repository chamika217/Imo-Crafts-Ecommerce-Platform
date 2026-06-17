import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  payhereNotify,
} from '../controllers/orderController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.post('/payhere-notify', payhereNotify); // PayHere server callback

// Admin routes
router.get('/', verifyAdmin, requireRole('staff'), getAllOrders);
router.get('/:id', verifyAdmin, requireRole('staff'), getOrderById);
router.put('/:id', verifyAdmin, requireRole('staff'), updateOrderStatus);
router.delete('/:id', verifyAdmin, requireRole('superAdmin'), deleteOrder);

export default router;
