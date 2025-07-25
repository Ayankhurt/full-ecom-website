import './App.css';
import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import Category from './pages/category';
import AddProduct from './pages/add-product';
import Home from './pages/home';
import Navbar from './pages/Navbar';
import { useContext, useEffect } from 'react';
import { GlobalContext } from './context/Context.jsx';

function App() {
  let {state, dispatch} = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/home/') {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Routes>
        {(state.isLogin === true) ?
          <>
            <Route path='/category' element={<Category />} />
            <Route path='/add-product' element={<AddProduct />} />
            <Route path='/home' element={<Home />} />
            <Route path='*' element={<Navigate to={"/home"} />} />
          </>
          :
          (state.isLogin === false) ?
            <>
              <Route path='/sign-up' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='*' element={<Navigate to={"/sign-up"} />} />
            </>
            :
            <>
            </>
        }
      </Routes>
    </div>
  );
}

export default App;
