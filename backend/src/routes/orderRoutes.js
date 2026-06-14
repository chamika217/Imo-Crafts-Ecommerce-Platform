import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Admin routes
router.get('/', verifyAdmin, getAllOrders);
router.get('/:id', verifyAdmin, getOrderById);
router.put('/:id', verifyAdmin, updateOrderStatus);
router.delete('/:id', verifyAdmin, deleteOrder);

export default router;