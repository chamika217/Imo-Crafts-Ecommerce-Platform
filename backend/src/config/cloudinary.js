import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
// chore: update 19 - 2026-06-14T20:29:54

// chore: update 58 - 2026-06-11T01:43:53

// chore: update 62 - 2026-06-13T11:59:23
