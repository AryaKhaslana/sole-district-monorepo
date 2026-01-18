import ProductDetail from './ProductDetail'
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CartPage from './CartPage';
import OrderHistory from './OrderHistory';
import LoginPage from './LoginPage';

function App() {
  return (

      <Routes>
      {/* Halaman Depan */}
      <Route path="/" element={<HomePage />} /> 

      {/* Halaman Detail (Perhatikan :id) */}
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/cart" element={<CartPage/>} />

      <Route path='/history' element={<OrderHistory/>} />

      <Route path='/login' element={<LoginPage/>} />
     </Routes>

  );
}

export default App