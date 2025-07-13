// src/AddProduct.jsx
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
    const [imageFile, setImageFile] = useState(null); // State for the selected image file
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

    const handleImageChange = (e) => {
        // Get the first selected file
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Validate required fields
        if (!form.name || !form.description || !form.price || !form.category_id || !imageFile) {
            swal("Error", "Please fill all fields and select an image.", "error");
            setSubmitting(false);
            return;
        }

        // Create FormData to send both text fields and the file
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', parseFloat(form.price)); // Ensure price is a number
        formData.append('category_id', form.category_id);
        formData.append('image', imageFile); // 'image' should match the field name in upload.single('image') in backend

        try {
            // Use api.post with the correct admin endpoint
            const res = await api.post(`/admin/product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Essential for sending files
                }
            });
            swal("Success", res.data.message || 'Product added!', "success");
            // Reset form fields and image state after successful submission
            setForm({ name: '', description: '', price: '', category_id: '' });
            setImageFile(null);
            // Optionally, clear the file input visual
            if (document.getElementById('productImage')) {
                document.getElementById('productImage').value = '';
            }

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
                <label htmlFor="productImage">Product Image:</label>
                <input
                    type="file"
                    id="productImage"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*" // Only allow image files
                    required
                />
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