import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css'; // Make sure to import your CSS
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
      navigate('/login'); // Redirect to login even if logout fails on server side
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
          (state.user && state.user.user_role == 1) ? // Added check for state.user existence
          <NavLink to="/add-product" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Product</NavLink>
          :
          null
        }

        {
          (state.user && state.user.user_role == 1) ? // Added check for state.user existence
          <NavLink to="/category" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Category</NavLink>
          :
          null
        }
        {state.user && <button className="logout-btn" onClick={handleLogout}>Logout</button>} {/* Show logout only if user is logged in */}
      </div>
    </nav>
  );
};

export default Navbar;