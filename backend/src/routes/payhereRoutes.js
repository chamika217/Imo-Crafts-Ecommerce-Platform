import express from 'express';
import { generateHash } from '../controllers/payhereController.js';

const router = express.Router();

// Public - generate payment hash (called before PayHere popup)
router.post('/hash', generateHash);

export default router;
