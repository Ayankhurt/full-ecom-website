import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import api from "../api";
import swal from 'sweetalert';

const AddProduct = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category_id: ''
    });
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {
        try {
            let res = await api.get(`/categories`);
            setCategoryList(res.data.category_list);
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await api.post(`/product`, {
                ...form,
                price: parseFloat(form.price)
            });
            swal("Success", res.data.message || 'Product added!', "success");
            setForm({ name: '', description: '', price: '', image: '', category_id: '' });
        } catch (err) {
            let msg = err?.response?.data?.error || err?.message || 'Error adding product.';
            swal("Error", msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="home-container">
            <h1>Add Product</h1>
            <form className="category-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="category_id" style={{fontWeight: 'bold', marginTop: '0.5rem'}}>Category</label>
                <select
                    id="category_id"
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
                {message && (
                    <div className={message.type === 'success' ? 'msg-success' : 'msg-error'}>{message.text}</div>
                )}
            </form>
        </div>
    );
};

export default AddProduct;
