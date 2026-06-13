import { db } from '../config/firebase.js';

// Get all inquiries
export const getAllInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    let query = db.collection('customInquiries').orderBy('createdAt', 'desc');

    if (status) query = db.collection('customInquiries').where('status', '==', status);

    const snapshot = await query.get();
    const inquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single inquiry
export const getInquiryById = async (req, res) => {
  try {
    const doc = await db.collection('customInquiries').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create inquiry
export const createInquiry = async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection('customInquiries').add(inquiryData);
    res.status(201).json({ id: docRef.id, ...inquiryData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inquiry status
export const updateInquiryStatus = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.collection('customInquiries').doc(req.params.id).update(updateData);
    res.status(200).json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inquiry
export const deleteInquiry = async (req, res) => {
  try {
    await db.collection('customInquiries').doc(req.params.id).delete();
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// chore: update 13 - 2026-06-14T04:06:31
