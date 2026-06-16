import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Role permission map - what each role can access
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
        // Get role from custom claims
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const role = tokenResult.claims.role || 'superAdmin'; // fallback for existing admin
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
    setUserRole(null);
    return await signOut(auth);
  };

  const hasPermission = (page) => {
    if (!userRole) return false;
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(page);
  };

  const isSuperAdmin = () => userRole === 'superAdmin';

  const value = {
    user,
    userRole,
    loading,
    login,
    logout,
    hasPermission,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
