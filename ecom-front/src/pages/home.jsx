import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import api from "../api";
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
                const [prodRes, catRes] = await Promise.all([
                    api.get(`/products`),
                    api.get(`/categories`)
                ]);
                setProducts(prodRes.data.products || []);
                setCategories(catRes.data.category_list || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(prod => prod.category_name === selectedCategory);

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="home-container">
            <h1>Welcome to the E-Commerce Store</h1>
            <section className="products-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
                        <p>No products found.</p>
                    ) : (
                        filteredProducts.map(prod => (
                            <div className="product-card" key={prod.product_id}>
                                <h3>{prod.product_name}</h3>
                                <p>Category: {prod.category_name}</p>
                                <p>Price: ${prod.price}</p>
                                <p>{prod.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home
