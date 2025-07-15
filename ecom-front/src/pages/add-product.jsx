import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import api from "../api"; // Assuming 'api' is your axios instance
import swal from 'sweetalert';

const AddProduct = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category_id: ''
    });
    // Removed: const [imageFile, setImageFile] = useState(null); // No longer needed
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {
        try {
            let res = await api.get(`/categories`);
            setCategoryList(res.data.category_list);
        } catch (error) {
            console.error('Error fetching categories:', error);
            swal("Error", "Failed to load categories.", "error");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Removed: const handleImageChange = (e) => { ... }; // No longer needed

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Validate required fields (imageFile validation removed)
        if (!form.name || !form.description || !form.price || !form.category_id) {
            swal("Error", "Please fill all fields.", "error"); // Adjusted message
            setSubmitting(false);
            return;
        }

        // No FormData needed, just send JSON
        const productData = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price), // Ensure price is a number
            category_id: form.category_id
        };

        try {
            // Use api.post with the correct admin endpoint and send JSON
            const res = await api.post(`/product`, productData); // Sending productData as JSON
            swal("Success", res.data.message || 'Product added!', "success");
            // Reset form fields after successful submission
            setForm({ name: '', description: '', price: '', category_id: '' });
            // Removed: setImageFile(null); and clearing file input
        } catch (err) {
            let msg = err?.response?.data?.message || err?.message || 'Error adding product.';
            console.error("Add Product Frontend Error:", err);
            swal("Error", msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="home-container">
            <h1>Add New Product</h1>
            <form className="product-form" onSubmit={handleSubmit}>
                <label htmlFor="productName">Product Name:</label>
                <input
                    type="text"
                    id="productName"
                    name="name"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="productDescription">Product Description:</label>
                <textarea
                    id="productDescription"
                    name="description"
                    placeholder="Provide a detailed description of the product."
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="productPrice">Price:</label>
                <input
                    type="number"
                    id="productPrice"
                    name="price"
                    placeholder="Enter price (e.g., 99.99)"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
                {/* Removed: Image Upload Input */}
                {/* <label htmlFor="productImage">Product Image:</label>
                <input
                    type="file"
                    id="productImage"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                /> */}
                <label htmlFor="productCategory">Category:</label>
                <select
                    id="productCategory"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categoryList?.map((eachCategory) => (
                        <option value={eachCategory.category_id} key={eachCategory.category_id}>
                            {eachCategory.category_name}
                        </option>
                    ))}
                </select>
                <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Product'}</button>
            </form>
        </div>
    );
};

export default AddProduct;