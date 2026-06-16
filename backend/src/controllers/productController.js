import { db } from '../config/firebase.js';
import { sendLowStockAlert } from '../services/emailService.js';

const LOW_STOCK_THRESHOLD = 5;

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    let query = db.collection('products');

    if (category) query = query.where('categoryId', '==', category);
    if (status) query = query.where('status', '==', status);
    if (featured) query = query.where('featured', '==', true);

    const snapshot = await query.get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const snapshot = await db.collection('products')
      .where('featured', '==', true)
      .where('status', '==', 'active')
      .get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId, stockQty, status, featured, images } = req.body;

    const productData = {
      name: name?.trim(),
      price: Number(price),
      description: description?.trim() || '',
      categoryId: categoryId || '',
      stockQty: Number.isFinite(Number(stockQty)) ? Number(stockQty) : 0,
      status: status || 'active',
      featured: Boolean(featured),
      images: Array.isArray(images) ? images : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(productData);
    res.status(201).json({ id: docRef.id, ...productData });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('products').doc(req.params.id).update(updateData);

    // Check if stock was updated and send alert if low
    if (req.body.stockQty !== undefined) {
      const newQty = Number(req.body.stockQty);
      if (newQty <= LOW_STOCK_THRESHOLD) {
        const doc = await db.collection('products').doc(req.params.id).get();
        const product = { id: doc.id, ...doc.data() };
        sendLowStockAlert({
          products: [{ ...product, stockQty: newQty }],
          adminEmail: process.env.ADMIN_EMAIL,
        }).catch(err => console.error('Low stock email failed:', err));
      }
    }

    res.status(200).json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// chore: update 108 - 2026-06-10T22:55:06
