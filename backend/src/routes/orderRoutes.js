import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  payhereNotify,
  getOrdersByCustomer,
} from '../controllers/orderController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.post('/payhere-notify', payhereNotify);
router.get('/customer', getOrdersByCustomer);

// staff + orderManager + superAdmin
router.get('/', verifyAdmin, requireRole('staff', 'orderManager'), getAllOrders);
router.get('/:id', verifyAdmin, requireRole('staff', 'orderManager'), getOrderById);
router.put('/:id', verifyAdmin, requireRole('staff', 'orderManager'), updateOrderStatus);
router.delete('/:id', verifyAdmin, requireRole('superAdmin'), deleteOrder);

export default router;
