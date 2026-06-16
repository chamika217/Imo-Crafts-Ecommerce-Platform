import { auth } from '../config/firebase.js';

// Verify any logged-in admin
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    req.user = decodedToken;
    req.userRole = decodedToken.role || 'superAdmin'; // no claim = existing owner account
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Token verification failed' });
  }
};

// Role-based access control middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole || req.user?.role;

    // superAdmin can access everything
    if (userRole === 'superAdmin') return next();

    // If no role claim set, treat as superAdmin (existing admin accounts)
    if (!userRole || userRole === undefined) return next();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }
    next();
  };
};

// Role permissions map
export const ROLE_PERMISSIONS = {
  superAdmin: ['*'],
  staff: ['orders:read', 'orders:write', 'customers:read', 'inquiries:read', 'inquiries:write'],
  inventoryManager: ['products:read', 'products:write', 'inventory:read', 'inventory:write'],
  contentManager: ['products:read', 'products:write', 'media:read', 'media:write', 'promotions:read', 'promotions:write', 'reviews:read', 'reviews:write'],
};
