import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Admin only routes
router.post('/', verifyAdmin, upload.single('image'), uploadImage);
router.delete('/:publicId', verifyAdmin, deleteImage);

export default router;
// chore: update 7 - 2026-06-11T12:02:02

// chore: update 46 - 2026-06-12T11:09:39
