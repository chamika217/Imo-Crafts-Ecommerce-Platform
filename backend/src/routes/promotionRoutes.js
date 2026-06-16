import express from 'express';
import { validateCoupon } from '../controllers/promotionController.js';

const router = express.Router();

// Public - validate coupon
router.post('/validate', validateCoupon);

export default router;
