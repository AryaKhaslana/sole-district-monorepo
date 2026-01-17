import ProductDetail from './ProductDetail'
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';

function App() {
  return (

      <Routes>
      {/* Halaman Depan */}
      <Route path="/" element={<HomePage />} /> 

      {/* Halaman Detail (Perhatikan :id) */}
      <Route path="/product/:id" element={<ProductDetail />} />
     </Routes>

  );
}

export default App