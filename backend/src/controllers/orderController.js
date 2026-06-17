import { db } from '../config/firebase.js';

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = db.collection('orders').orderBy('createdAt', 'desc');

    if (status) query = db.collection('orders').where('orderStatus', '==', status);

    const snapshot = await query.get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      orderStatus: 'Pending',
      paymentMethod: 'COD',
      paymentStatus: 'Pending COD',
      paymentProvider: null,
      transactionId: null,
      paymentMeta: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('orders').add(orderData);

    // Save customer info
    if (orderData.customerInfo?.phone) {
      const customerData = {
        name: orderData.customerInfo.name,
        phone: orderData.customerInfo.phone,
        email: orderData.customerInfo.email || '',
        address: orderData.customerInfo.address || '',
        lastOrderDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingCustomer = await db.collection('customers')
        .where('phone', '==', orderData.customerInfo.phone)
        .get();

      if (existingCustomer.empty) {
        await db.collection('customers').add({
          ...customerData,
          orderCount: 1,
          createdAt: new Date().toISOString(),
        });
      } else {
        const customerDoc = existingCustomer.docs[0];
        await db.collection('customers').doc(customerDoc.id).update({
          ...customerData,
          orderCount: (customerDoc.data().orderCount || 0) + 1,
        });
      }
    }

    res.status(201).json({ id: docRef.id, ...orderData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('orders').doc(req.params.id).update(updateData);
    res.status(200).json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PayHere payment notification (server-side callback)
export const payhereNotify = async (req, res) => {
  try {
    const { order_id, status_code, payment_id } = req.body;

    // status_code 2 = success
    if (status_code === '2' && order_id) {
      await db.collection('orders').doc(order_id).update({
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        transactionId: payment_id || null,
        updatedAt: new Date().toISOString(),
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    await db.collection('orders').doc(req.params.id).delete();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// chore: update 17 - 2026-06-10T18:20:21

// chore: update 18 - 2026-06-13T07:07:16

// chore: update 53 - 2026-06-14T08:52:50
