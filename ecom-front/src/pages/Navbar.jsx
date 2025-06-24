import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder: Add your logout logic here
    alert('Logged out!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/home')}>
        EcomSite
      </div>
      <div className="navbar-links">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        <NavLink to="/add-product" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Product</NavLink>
        <NavLink to="/category" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Category</NavLink>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar; 