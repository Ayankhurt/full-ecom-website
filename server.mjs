// server.mjs
import 'dotenv/config'; // Make sure this is at the very top to load environment variables
import express from 'express';
import db from './db.mjs'; // Your PostgreSQL connection module
import cors from 'cors';
import bcrypt from "bcryptjs";
import { customAlphabet } from 'nanoid'; // If you're using this, keep it
import jwt from 'jsonwebtoken';
import path from 'path'; // Needed for serving static files
import cookieParser from 'cookie-parser';

// Import the configured Cloudinary uploader
import { upload } from './config/cloudinary.mjs'; // <--- IMPORTANT: Path to your Cloudinary config file

const app = express();
const PORT = 5004;

const SECRET = process.env.SECRET_TOKEN;

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5004'], // Allow requests from your React app
    credentials: true // Allow cookies to be sent
}));

app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies

// --- Authentication Routes (Sign-up, Login, Logout) ---

app.post('/api/v1/sign-up', async (req, res) => {
    let reqBody = req.body;
    if (!reqBody.firstName || !reqBody.lastName || !reqBody.email || !reqBody.password) {
        return res.status(400).send({ message: "Required parameter missing" });
    }
    reqBody.email = reqBody.email.toLowerCase();
    let query = `SELECT * FROM users WHERE email = $1`;
    let values = [reqBody.email];
    try {
        let result = await db.query(query, values);
        if (result.rows?.length) {
            return res.status(400).send({ message: "User Already Exist With This Email" });
        }
        let addQuery = `INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(reqBody.password, salt);
        let addValues = [reqBody.firstName, reqBody.lastName, reqBody.email, hash];
        await db.query(addQuery, addValues);
        res.status(201).send({ message: "User Created" });
    } catch (error) {
        console.error("SIGN-UP ERROR:", error); // Use console.error for errors
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post('/api/v1/login', async (req, res) => {
    let reqBody = req.body;
    if (!reqBody.email || !reqBody.password) {
        return res.status(400).send({ message: "Required Parameter Missing" });
    }
    reqBody.email = reqBody.email.toLowerCase();
    let query = `SELECT * FROM users WHERE email = $1`;
    let values = [reqBody.email];

    try {
        let result = await db.query(query, values);
        if (!result.rows.length) {
            return res.status(400).send({ message: "User Doesn't exist with this Email" });
        }
        let isMatched = await bcrypt.compare(reqBody.password, result.rows[0].password);

        if (!isMatched) {
            return res.status(401).send({ message: "Password did not Match" });
        }

        let token = jwt.sign({
            id: result.rows[0].user_id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name, // Fixed typo
            email: result.rows[0].email,
            user_role: result.rows[0].user_role,
            iat: Date.now() / 1000,
            exp: (Date.now() / 1000) + (60 * 60 * 24) // 1 day expiry
        }, SECRET);

        res.cookie('Token', token, {
            maxAge: 86400000, // 1 day in milliseconds
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
            sameSite: 'Lax', // Protects against CSRF
            path: '/'
        });
        res.status(200).send({
            message: "User Logged in", user: {
                user_id: result.rows[0].user_id,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                user_role: result.rows[0].user_role,
                profile: result.rows[0].profile,
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get('/api/v1/logout', (req, res) => {
    res.cookie('Token', '', {
        maxAge: 1, // Immediately expire
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/'
    });
    res.status(200).send({ message: "User Logout" });
});
app.post('/api/v1/admin/product', upload.single('image'), async (req, res) => {
    // ...
    const imageUrl = req.file.path; // Make sure you are using req.file.path
    // ...
});
// --- Authentication Middleware (for protected routes) ---
// This middleware runs for all routes starting with /api/v1/*splat (except sign-up, login, logout)
app.use('/api/v1/*splat', (req, res, next) => {
    if (!req?.cookies?.Token) {
        return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(req.cookies.Token, SECRET, (err, decodedData) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            res.cookie('Token', '', { maxAge: 1, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/' });
            return res.status(401).send({ message: "Unauthorized: Invalid or expired token" });
        }

        const nowDate = new Date().getTime() / 1000;
        if (decodedData.exp < nowDate) {
            res.cookie('Token', '', { maxAge: 1, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/' });
            return res.status(401).send({ message: "Unauthorized: Token expired" });
        } else {
            console.log("Token approved for user:", decodedData.email);
            // Attach decoded token data to req.body for downstream routes
            req.body = { ...req.body, token: decodedData };
            next();
        }
    });
});

// --- Protected Routes (User & Product Viewing) ---

app.get('/api/v1/profile', (req, res) => {
    console.log("req.body.token (from middleware):", req.body.token);
    res.status(200).send({ message: "User profile access granted", user: req.body.token });
});

app.get('/api/v1/user-detail', async (req, res) => {
    let userToken = req.body.token; // Data from JWT
    let query = `SELECT user_id, first_name, last_name, email, phone, user_role, profile FROM users WHERE user_id = $1`; // Select specific columns
    let value = [userToken.id];
    try {
        let result = await db.query(query, value);
        if (!result.rows.length) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User Found", user: result.rows[0] });
    } catch (error) {
        console.error("USER DETAIL ERROR:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get('/api/v1/categories', async (req, res) => {
    try {
        let result = await db.query(`SELECT * FROM categories ORDER BY category_name ASC`); // Order categories
        res.status(200).send({ message: "Categories Found", category_list: result.rows });
    } catch (error) {
        console.error("CATEGORIES ERROR:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get('/api/v1/products', async (req, res) => {
    // console.log("Request to /api/v1/products"); // This will show up if you access it via browser/frontend
    try {
        // Joining products with categories to get category_name
        let result = await db.query(`
            SELECT 
                p.product_id, 
                p.product_name, 
                p.price, 
                p.product_image, 
                p.description, 
                p.created_at, 
                c.category_name 
            FROM products AS p 
            INNER JOIN categories c ON p.category_id = c.category_id
            ORDER BY p.created_at DESC
        `); // Order products by creation date
        res.status(200).send({ message: "Product Found", products: result.rows });
    } catch (error) {
        console.error("PRODUCTS FETCH ERROR:", error);
        res.status(500).send({ message: "Internal Server Error", err: error.message });
    }
});

// --- Admin-only Middleware ---
// This middleware runs for routes requiring admin access (user_role = 1)
app.use('/api/v1/admin/*splat', (req, res, next) => { // Using a specific path for admin routes
    if (!req.body.token || req.body.token.user_role !== 1) { // Assuming 1 is the admin role
        return res.status(403).send({ message: "Forbidden: Admin access required" });
    } else {
        next();
    }
});

// --- Admin-only Routes ---

app.post('/api/v1/admin/category', async (req, res) => { // Changed to /api/v1/admin/category
    let reqBody = req.body;
    if (!reqBody.name || !reqBody.description) {
        return res.status(400).send({ message: "Required Parameter Missing" });
    }
    try {
        let query = `INSERT INTO categories(category_name, description) VALUES ($1, $2)`;
        let values = [reqBody.name, reqBody.description];
        await db.query(query, values);
        res.status(201).send({ message: "Category Added" });
    } catch (error) {
        console.error("ADD CATEGORY ERROR:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

// UPDATED PRODUCT POST ROUTE (Now admin-only)
app.post('/api/v1/admin/product', upload.single('image'), async (req, res) => { // <--- Changed to /api/v1/admin/product
    let { name, description, price, category_id } = req.body; // Multer will populate req.body

    // --- DEBUGGING ---
    console.log("------------------- PRODUCT UPLOAD REQUEST -------------------");
    console.log("req.file:", req.file); // THIS IS CRUCIAL: Should contain Cloudinary URL in req.file.path
    console.log("req.body:", req.body);
    console.log("------------------------------------------------------------");
    // --- END DEBUGGING ---

    // Ensure image is uploaded and path is available
    if (!req.file) {
        return res.status(400).send({ error: 'No image file uploaded or upload failed on Cloudinary.' });
    }

    // The fix: Use req.file.path for the Cloudinary URL
    const imageUrl = req.file.path; // <--- This will be the Cloudinary URL

    // Basic validation for other fields
    if (!name || !description || !price || !category_id) {
        // If image is null here, it means no file was uploaded or Cloudinary upload failed
        console.warn("Missing parameters for product:", { name, description, price, category_id, image: imageUrl });
        return res.status(400).send({ message: "Required product details missing (name, description, price, category_id)" });
    }

    // Validate price to be a number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).send({ message: "Invalid price provided." });
    }

    try {
        let query = `INSERT INTO products(product_name, price, description, product_image, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`; // RETURNING * to get back inserted product
        let values = [name, parsedPrice, description, imageUrl, category_id];
        let result = await db.query(query, values);
        res.status(201).send({ message: "Product Added Successfully!", product: result.rows[0], imageUrl: imageUrl });
    } catch (error) {
        console.error("ADD PRODUCT TO DB ERROR:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});


// Serve React Frontend Static Files (important for deployment)
const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './ecom-front/dist'))); // Assuming your React build is in ecom-front/dist
app.use('/*splat', express.static(path.join(__dirname, './ecom-front/dist'))); // Catch-all for client-side routing

// Start Server
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});