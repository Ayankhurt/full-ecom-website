import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import api from "../api";
import swal from 'sweetalert';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/categories`);
      setCategories(res.data.category_list || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
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
      const res = await api.post(`/category`, form);
      swal("Success", res.data.message || 'Category added!', "success");
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      let msg = err?.response?.data?.error || err?.message || 'Error adding category.';
      swal("Error", msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader">Loading categories...</div>;

  return (
    <div className="home-container">
      <h1>Manage Categories</h1>
      <form className="category-form" onSubmit={handleSubmit}>
        <h2>Add New Category</h2>
        <label htmlFor="categoryName">Category Name:</label>
        <input
          type="text"
          id="categoryName"
          name="name"
          placeholder="e.g., Electronics, Books, Clothing"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="categoryDescription">Category Description:</label>
        <textarea
          id="categoryDescription"
          name="description"
          placeholder="Brief description of the category..."
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Category'}</button>
        {message && (
          <div className={message.type === 'success' ? 'msg-success' : 'msg-error'}>{message.text}</div>
        )}
      </form>
      <section className="categories-section">
        <h2>Existing Categories</h2>
        <div className="categories-grid">
          {categories.length === 0 ? (
            <p>No categories found. Add one above!</p>
          ) : (
            categories.map(cat => (
              <div className="category-card" key={cat.category_id}>
                <h3>{cat.category_name}</h3>
                <p>{cat.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;