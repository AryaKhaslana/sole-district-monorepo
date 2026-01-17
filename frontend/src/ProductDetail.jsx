import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
    const { id } = useParams() 
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
        .then(response => {
            setProduct(response.data)
        })
        .catch(error => {
            console.error('gagal ngambil data', error)
        });
    }, [id]);

    if (!product) return <h1>Sabar loading...</h1>;

    return (
          <div style={{ padding: '50px' }}>
            <h1 style={{ fontSize: '3rem' }}>{product.name}</h1>
            <p>Harga: Rp {product.price}</p>
            <p>Stok: {product.stock}</p>
            <p>{product.description}</p>
            
            <button style={{ 
                padding: '10px 20px', 
                backgroundColor: 'black', 
                color: 'white', 
                marginTop: '20px' 
            }}>
                Beli Sekarang 🛒
            </button>
        </div>
    );
}