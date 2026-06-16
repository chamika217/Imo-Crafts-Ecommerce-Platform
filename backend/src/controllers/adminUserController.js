import { db, auth } from '../config/firebase.js';

// Get all admin users
export const getAdminUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('adminUsers').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create / invite admin user & set role
export const createAdminUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const validRoles = ['superAdmin', 'staff', 'inventoryManager', 'contentManager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({ email, password, displayName: name });

    // Set custom claim role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Save to Firestore
    await db.collection('adminUsers').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    });

    res.status(201).json({ uid: userRecord.uid, email, name, role });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update role
export const updateAdminRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { uid } = req.params;

    const validRoles = ['superAdmin', 'staff', 'inventoryManager', 'contentManager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await auth.setCustomUserClaims(uid, { role });
    await db.collection('adminUsers').doc(uid).update({
      role,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ uid, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete admin user
export const deleteAdminUser = async (req, res) => {
  try {
    const { uid } = req.params;

    // Prevent self-delete
    if (uid === req.user.uid) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await auth.deleteUser(uid);
    await db.collection('adminUsers').doc(uid).delete();

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
