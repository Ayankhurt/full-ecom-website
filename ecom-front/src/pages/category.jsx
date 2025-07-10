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
      const res = await api.post(`/categories`, form);
      swal("Success", res.data.message || 'Category added!', "success");
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      swal("Error", err.response?.data?.error || 'Error adding category.', "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="home-container">
      <h1>Categories</h1>
      <form className="category-form" onSubmit={handleSubmit}>
        <h2>Add New Category</h2>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Category Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Category'}</button>
        {message && (
          <div className={message.type === 'success' ? 'msg-success' : 'msg-error'}>{message.text}</div>
        )}
      </form>
      <div className="categories-grid">
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map(cat => (
            <div className="category-card" key={cat.category_id}>
              <h3>{cat.category_name}</h3>
              <p>{cat.description}</p>
              <button
                className="delete-btn"
                onClick={async () => {
                  if (window.confirm('Delete this category?')) {
                    try {
                      await axios.delete(`${BASE_URL}category/${cat.category_id}`);
                      fetchCategories();
                    } catch (err) {
                      swal("Error", 'Error deleting category', "error");
                    }
                  }
                }}
              >Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Category;