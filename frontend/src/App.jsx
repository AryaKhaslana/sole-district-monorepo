import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import Navbar from './Navbar';
import ProductDetail from './ProductDetail'
import HomePage from './HomePage';
import CartPage from './CartPage';
import OrderHistory from './OrderHistory';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';

function App() {
  return (
      <Router>
      
      {/* Navbar ditaruh di sini biar muncul terus */}
      <Navbar/>

      {/* 3. PEMBUNGKUS HALAMAN (Routes - Pengganti Switch) */}
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path='/history' element={<OrderHistory/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/register" element={<RegisterPage />} />
     </Routes>

    </Router>

  );
}

export default App