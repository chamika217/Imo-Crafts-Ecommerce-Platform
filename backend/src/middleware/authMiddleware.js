import { auth } from '../config/firebase.js';

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
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Token verification failed' });
  }
};
// chore: update 54 - 2026-06-11T04:39:35

// chore: update 76 - 2026-06-13T03:39:29

// chore: update 142 - 2026-06-14T03:17:31
