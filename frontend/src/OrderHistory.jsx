import { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const Navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token) {
            alert("login dulu bro biar bisa liat riwayat")
            Navigate('/login');
            return;
        }

        axios.get("http://127.0.0.1:8000/api/orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log("data error:", res.data) 
            setOrders(res.data);
        })
        .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("sesi habis, login lagi ya");
                Navigate('/login')
            }
        });
        
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Riwayat Pesanan 📜</h1>

            {/* LOOPING 1: UNTUK SETIAP NOTA (ORDER) */}
            {orders.map((order) => (
                <div key={order.id} style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    marginBottom: '20px',
                    backgroundColor: '#2a2a2a' // Biar agak gelap dikit
                }}>
                    {/* HEADER NOTA */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3>Order #{order.id}</h3>
                        <span style={{ color: 'yellow' }}>Status: {order.status}</span>
                    </div>
                    <p>Total Bayar: <b>Rp {order.total_price}</b></p>
                    
                    <hr style={{ borderColor: '#444' }}/>
                    
                    {/* LOOPING 2: UNTUK SETIAP BARANG DI DALAM NOTA */}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {order.items.map((item) => (
                            <li key={item.id} style={{ padding: '5px 0', borderBottom: '1px dashed #444' }}>
                                {/* CLUE: Inget 'product' itu object di dalam 'item' */}
                                📦 {item.product.name} (x{item.quantity})
                                <span style={{ float: 'right' }}>
                                    @ Rp {item.price}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}