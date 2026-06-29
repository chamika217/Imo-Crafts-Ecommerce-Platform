import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const ROLE_PERMISSIONS = {
  superAdmin: ['dashboard', 'products', 'orders', 'customers', 'inventory', 'inquiries', 'media', 'promotions', 'reviews', 'reports', 'users'],
  staff: ['dashboard', 'orders', 'customers', 'inquiries'],
  inventoryManager: ['dashboard', 'products', 'inventory'],
  contentManager: ['dashboard', 'products', 'media', 'promotions', 'reviews'],
};

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
    // Replace entire history stack so back button cannot return to admin
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
