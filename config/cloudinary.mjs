// config/cloudinary.mjs
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config'; // Make sure dotenv is loaded to access environment variables

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Configuration for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecom-products', // This is the folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: Image resize/transformations
  },
});

// Multer Uploader using Cloudinary Storage
const upload = multer({ storage: storage });

export { cloudinary, upload }; // Export both cloudinary and the uploader