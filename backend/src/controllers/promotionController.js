import { db } from '../config/firebase.js';

// Validate coupon code
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const snapshot = await db.collection('promotions')
      .where('couponCode', '==', code.toUpperCase().trim())
      .where('active', '==', true)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    const promo = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    const today = new Date().toISOString().split('T')[0];

    // Check date range
    if (promo.startDate && today < promo.startDate) {
      return res.status(400).json({ message: 'This coupon is not active yet' });
    }
    if (promo.endDate && today > promo.endDate) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    // Check minimum order amount
    if (promo.minOrderAmount && orderTotal < promo.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of Rs. ${promo.minOrderAmount.toLocaleString()} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((orderTotal * promo.discountValue) / 100);
    } else {
      discountAmount = Math.min(promo.discountValue, orderTotal);
    }

    res.status(200).json({
      valid: true,
      couponCode: promo.couponCode,
      title: promo.title,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount,
      finalTotal: orderTotal - discountAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
