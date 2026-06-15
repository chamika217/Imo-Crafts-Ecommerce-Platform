import { db } from '../config/firebase.js';

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const snapshot = await db.collection('customers')
      .orderBy('createdAt', 'desc')
      .get();
    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single customer
export const getCustomerById = async (req, res) => {
  try {
    const doc = await db.collection('customers').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('customers').doc(req.params.id).update(updateData);
    res.status(200).json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    await db.collection('customers').doc(req.params.id).delete();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// chore: update 1 - 2026-06-14T13:27:34

// chore: update 96 - 2026-06-15T15:11:55
