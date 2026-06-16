import express from 'express';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminRole,
  deleteAdminUser,
} from '../controllers/adminUserController.js';
import { verifyAdmin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require superAdmin
router.get('/', verifyAdmin, requireRole('superAdmin'), getAdminUsers);
router.post('/', verifyAdmin, requireRole('superAdmin'), createAdminUser);
router.put('/:uid', verifyAdmin, requireRole('superAdmin'), updateAdminRole);
router.delete('/:uid', verifyAdmin, requireRole('superAdmin'), deleteAdminUser);

export default router;
