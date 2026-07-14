import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import payhereRoutes from './routes/payhereRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
      // Allow all vercel.app subdomains for this project
      /^https:\/\/imo-crafts-ecommerce-platform.*\.vercel\.app$/,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });
    
    // Allow all origins in development / always allow for now
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/admin-users', adminUserRoutes);
app.use('/api/payhere', payhereRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Imo Crafts API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// chore: update 78 - 2026-06-12T08:15:43
