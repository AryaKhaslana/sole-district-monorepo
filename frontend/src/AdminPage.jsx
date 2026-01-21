import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('products'); // 'products' atau 'orders'
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // State buat Form Produk
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. CEK ADMIN & FETCH DATA AWAL
    useEffect(() => {
        if (!token || !user || user.role !== 'admin') {
            alert("MAU NGAPAIN? LU BUKAN ADMIN! 👮‍♂️");
            navigate('/');
        } else {
            fetchProducts();
            fetchOrders(); // <--- Fetch Orderan juga
        }
    }, []);

    // --- API CALLS ---
    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/products');
            setProducts(res.data.data);
        } catch (error) { console.error("Gagal ambil produk", error); }
    };

    const fetchOrders = async () => {
        try {
            // Karena lu Admin, API ini bakal balikin SEMUA order orang lain
            const res = await axios.get('http://127.0.0.1:8000/api/orders', {
                headers: { Authorization: `Bearer ${token}` } // <--- INGET TOKEN!
            });
            setOrders(res.data);
        } catch (error) { console.error("Gagal ambil order", error); }
    };

    // FITUR ACC PESANAN (VERIFIKASI)
    const handleVerifyPayment = async (orderId) => {
        if (!confirm("Yakin mau ACC pesanan ini? Duit udah masuk kan? 💸")) return;

        try {
            await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/verify`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Pesanan Diterima! Status berubah jadi PAID ✅");
            fetchOrders(); // Refresh tabel
        } catch (error) {
            alert("Gagal verifikasi bro.");
        }
    };

    // FITUR TAMBAH PRODUK (Sama kayak kemaren)
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await axios.post('http://127.0.0.1:8000/api/products', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert("Produk nambah bos!");
            fetchProducts();
            setName(''); setPrice(''); setStock(''); setDescription('');
        } catch (error) { alert("Gagal nambah produk."); }
    };

    // FITUR HAPUS PRODUK
    const handleDeleteProduct = async (id) => {
        if (confirm("Hapus barang ini?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
            } catch (error) { alert("Gagal hapus."); }
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>👮‍♂️ Dashboard Admin</h1>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ background: 'red', color: 'white', padding: '10px' }}>Logout</button>
            </div>
            
            {/* --- TAB MENU --- */}
            <div style={{ margin: '20px 0', borderBottom: '1px solid #333' }}>
                <button 
                    onClick={() => setActiveTab('products')}
                    style={{ padding: '10px 20px', background: activeTab === 'products' ? '#007bff' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    📦 Kelola Produk
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    style={{ padding: '10px 20px', background: activeTab === 'orders' ? '#007bff' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    📜 Kelola Pesanan Masuk
                </button>
            </div>

            {/* --- KONTEN TAB PRODUK --- */}
            {activeTab === 'products' && (
                <div style={{ display: 'flex', gap: '30px' }}>
                    {/* FORM INPUT (KIRI) */}
                    <div style={{ flex: 1, background: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
                        <h3>➕ Tambah Barang</h3>
                        <form onSubmit={handleAddProduct}>
                            <input type="text" placeholder="Nama Barang" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                            <input type="number" placeholder="Harga" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                            <input type="number" placeholder="Stok" value={stock} onChange={e => setStock(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                            <textarea placeholder="Deskripsi" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}></textarea>
                            <input type="file" onChange={e => setImage(e.target.files[0])} style={{ marginBottom: '10px' }} />
                            <button type="submit" style={{ width: '100%', background: 'green', color: 'white', padding: '10px' }}>Simpan</button>
                        </form>
                    </div>

                    {/* TABEL LIST (KANAN) */}
                    <div style={{ flex: 2 }}>
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#444' }}>
                            <thead>
                                <tr style={{ background: '#333' }}>
                                    <th>Nama</th><th>Harga</th><th>Stok</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.stock}</td>
                                        <td><button onClick={() => handleDeleteProduct(item.id)} style={{ background: 'red', color: 'white', border: 'none' }}>Hapus</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- KONTEN TAB ORDERS (BARU!) --- */}
            {activeTab === 'orders' && (
                <div>
                    <h3>📜 Daftar Pesanan Masuk</h3>
                    {orders.length === 0 ? <p>Belum ada yang beli nih sepi...</p> : (
                        orders.map(order => (
                            <div key={order.id} style={{ background: '#1e1e1e', padding: '15px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4>Order #{order.id} - Total: Rp {order.total_price.toLocaleString()}</h4>
                                    
                                    {/* TOMBOL VERIFIKASI (Hanya muncul kalau PENDING) */}
                                    {order.status === 'pending' ? (
                                        <button 
                                            onClick={() => handleVerifyPayment(order.id)}
                                            style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 15px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            💰 TERIMA PEMBAYARAN
                                        </button>
                                    ) : (
                                        <span style={{ color: 'lightgreen', fontWeight: 'bold' }}>✅ LUNAS (PAID)</span>
                                    )}
                                </div>
                                
                                <ul style={{ marginTop: '10px', background: '#252525', padding: '10px' }}>
                                    {order.items.map(item => (
                                        <li key={item.id}>📦 {item.product?.name} (x{item.quantity})</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPage;