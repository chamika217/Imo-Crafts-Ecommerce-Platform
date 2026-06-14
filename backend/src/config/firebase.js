import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Local dev: fix "unable to verify the first certificate" on some Windows networks
if (process.env.ALLOW_INSECURE_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
// Use REST instead of gRPC — avoids hangs on networks that block gRPC
db.settings({ preferRest: true });

const auth = admin.auth();

export { db, auth };
export default admin;