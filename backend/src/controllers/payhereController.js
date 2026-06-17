import crypto from 'crypto';

// Generate PayHere hash for payment authorization
export const generateHash = async (req, res) => {
  try {
    const { merchant_id, order_id, amount, currency } = req.body;

    if (!merchant_id || !order_id || !amount || !currency) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      return res.status(500).json({ message: 'Payment gateway not configured' });
    }

    // PayHere hash formula:
    // MD5( merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase() ).toUpperCase()
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2);

    const hash = crypto
      .createHash('md5')
      .update(merchant_id + order_id + amountFormatted + currency + hashedSecret)
      .digest('hex')
      .toUpperCase();

    res.status(200).json({ hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
