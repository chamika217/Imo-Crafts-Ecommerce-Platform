import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Role definitions with permissions
export const ROLES = {
  superAdmin: {
    label: 'Super Admin',
    color: 'bg-amber-500',
    desc: 'Full access to all modules and permission management',
    pages: ['dashboard', 'products', 'orders', 'customers', 'inventory', 'inquiries', 'media', 'promotions', 'reviews', 'reports', 'users'],
  },
  orderManager: {
    label: 'Order Manager',
    color: 'bg-blue-600',
    desc: 'Access to orders, order status updates, and customer order management',
    pages: ['dashboard', 'orders', 'customers', 'reports'],
  },
  inventoryManager: {
    label: 'Inventory Manager',
    color: 'bg-green-600',
    desc: 'Access to inventory, products, stock management, and related reports',
    pages: ['dashboard', 'products', 'inventory', 'reports'],
  },
  contentManager: {
    label: 'Content Manager',
    color: 'bg-purple-600',
    desc: 'Access to website content, categories, promotions, media, and reviews',
    pages: ['dashboard', 'products', 'media', 'promotions', 'reviews'],
  },
  customerSupport: {
    label: 'Customer Support',
    color: 'bg-pink-600',
    desc: 'Access to inquiries, customer messages, and review management',
    pages: ['dashboard', 'inquiries', 'customers', 'reviews'],
  },
  staff: {
    label: 'Staff',
    color: 'bg-indigo-500',
    desc: 'Access to orders, customers, and inquiries',
    pages: ['dashboard', 'orders', 'customers', 'inquiries'],
  },
};

// Flatten permissions for easy lookup
export const ROLE_PERMISSIONS = Object.fromEntries(
  Object.entries(ROLES).map(([key, val]) => [key, val.pages])
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const role = tokenResult.claims.role || 'superAdmin';
        setUser(firebaseUser);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const tokenResult = await result.user.getIdTokenResult(true);
    const role = tokenResult.claims.role || 'superAdmin';
    setUserRole(role);
    return result;
  };

  const logout = async () => {
    setUser(null);
    setUserRole(null);
    await signOut(auth);
    window.history.go(-(window.history.length - 1));
    window.location.replace('/admin/login');
  };

  const hasPermission = (page) => {
    if (!userRole) return false;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(page);
  };

  const isSuperAdmin = () => userRole === 'superAdmin';

  const value = { user, userRole, loading, login, logout, hasPermission, isSuperAdmin };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
