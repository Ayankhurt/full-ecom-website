// src/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; // Ensure your CSS is correctly imported
import { useNavigate } from 'react-router-dom';
import api from "../api"; // Assuming this is your configured axios instance
import swal from 'sweetalert';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products and categories concurrently
                const [prodRes, catRes] = await Promise.all([
                    api.get(`/products`), // Fetch products
                    api.get(`/categories`) // Fetch categories
                ]);
                setProducts(prodRes.data.products || []);
                setCategories(catRes.data.category_list || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                swal("Error", "Failed to load products or categories. Please try again.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(prod => prod.category_name === selectedCategory);

    if (loading) {
        return <div className="loader">Loading products and categories...</div>;
    }

    return (
        <div className="home-container">
            <h1>Welcome to the E-Commerce Store</h1>
            <section className="products-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                    <label htmlFor="categoryFilter" style={{ fontWeight: 'bold' }}>Filter by Category:</label>
                    <select
                        id="categoryFilter"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="category-filter-dropdown"
                    >
                        <option value="all">All</option>
                        {categories.map(cat => (
                            <option value={cat.category_name} key={cat.category_id}>{cat.category_name}</option>
                        ))}
                    </select>
                </div>
                <h2>Products</h2>
                <div className="products-grid">
                    {filteredProducts.length === 0 ? (
                        <p>No products found in this category.</p>
                    ) : (
                        filteredProducts.map(prod => (
                            <div className="product-card" key={prod.product_id}>
                                {/* Display image only if prod.product_image exists and is a valid string */}
                                {prod.product_image && typeof prod.product_image === 'string' && prod.product_image.trim() !== '' && (
                                    <img
                                        src={prod.product_image} // <--- Use prod.product_image from DB
                                        alt={prod.product_name}
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            maxHeight: '200px', // Added a max-height for consistent card size
                                            objectFit: 'contain', // Ensures the image fits within the bounds without cropping
                                            borderRadius: '8px',
                                            marginBottom: '1rem' // Added bottom margin for spacing
                                        }}
                                    />
                                )}
                                <h3>{prod.product_name}</h3>
                                <p>Category: <strong>{prod.category_name}</strong></p>
                                <p>Price: <strong>${parseFloat(prod.price).toFixed(2)}</strong></p>
                                <p>{prod.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;