import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <--- Kita butuh ini buat link

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div style={{ padding: '40px', color: 'white' }}>
      <h1>👟 STRIDE COMMERCE</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map(item => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{item.name}</h3>
            <p>Rp {item.price}</p>
            
            {/* TOMBOL KE HALAMAN DETAIL */}
            <Link to={`/product/${item.id}`}>
                <button style={{ background: 'blue', color: 'white', padding: '5px 10px' }}>
                    Lihat Detail 👉
                </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}