import './App.css';
import { Navigate, Route, Routes } from 'react-router';
import Signup from './pages/signup';
import Login from './pages/login';
import Category from './pages/category';
import AddProduct from './pages/add-product';
import Home from './pages/home';
import Navbar from './pages/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/category' element={<Category />} />
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/home' element={<Home />} />
        <Route path='*' element={<Navigate to={"/sign-up"} />} />
      </Routes>
    </div>
  );
}

export default App;