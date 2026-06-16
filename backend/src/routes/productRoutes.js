import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from '../controllers/productController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// inventoryManager + contentManager + superAdmin can manage products
router.post('/', verifyAdmin, requireRole('inventoryManager', 'contentManager'), createProduct);
router.put('/:id', verifyAdmin, requireRole('inventoryManager', 'contentManager'), updateProduct);
router.delete('/:id', verifyAdmin, requireRole('inventoryManager', 'contentManager'), deleteProduct);

export default router;
