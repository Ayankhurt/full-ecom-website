// routes/productRoutes.js (This is just an example, adjust according to your actual file)
import express from 'express';
const router = express.Router();
const { upload } = from '../config/cloudinary'; // Cloudinary uploader import karein
// Assuming your product controller/model is here
// const productController = require('../controllers/productController');

// Example route for adding a product
router.post(
  '/product',
  // Middleware for single image upload with field name 'image'
  upload.single('image'), // <-- Yeh line add karein
  async (req, res) => {
    try {
      // Multer file object req.file mein hoga agar upload successful hai
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
      }

      const imageUrl = req.file.path; // Cloudinary se mili image URL
      const { name, description, price, category_id } = req.body;

      // Yahan aap apna database logic add karein to save product with imageUrl
      // Example:
      const newProduct = {
        name,
        description,
        price,
        image: imageUrl, // <-- Image URL ko database mein save karein
        category_id
      };
      // Save newProduct to your database (e.g., using Mongoose, Sequelize, or raw SQL)

      // Dummy response for demonstration
      res.status(201).json({
        message: 'Product added successfully!',
        product: newProduct,
        imageUrl: imageUrl // Optional: return image URL in response
      });

    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: error.message || 'Failed to add product' });
    }
  }
);

module.exports = router;