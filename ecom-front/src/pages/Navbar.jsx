import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';
import { GlobalContext } from '../context/Context.jsx';
import api from '../api';

const Navbar = () => {
    let {state, dispatch} = useContext(GlobalContext)
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get('/logout');
      dispatch({ type: 'USER_LOGOUT' });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/home')}>
        EcomSite
      </div>
      <div className="navbar-links">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        {
        (state.user.user_role == 1)?
        <div className=""><NavLink to="/add-product" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Product</NavLink></div>
        :
        null
      }
      
      {
        (state.user.user_role == 1)?
        <div className=""><NavLink to="/category" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Category</NavLink></div>
        :
        null
      }
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar; 