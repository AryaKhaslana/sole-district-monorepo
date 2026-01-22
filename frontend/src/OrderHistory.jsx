import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [uploading, setUploading] = useState(false); // Buat indikator loading pas upload
    const Navigate = useNavigate();
    
    // 1. KITA PISAH FUNGSI FETCH BIAR BISA DIPANGGIL ULANG
    const fetchOrders = () => {
        const token = localStorage.getItem('token');

        if(!token) {
            alert("Login dulu bro biar bisa liat riwayat");
            Navigate('/login');
            return;
        }

        axios.get("http://127.0.0.1:8000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            console.log("Data orders:", res.data);
            setOrders(res.data);
        })
        .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("Sesi habis, login lagi ya");
                Navigate('/login');
            }
        });
    };

    // Panggil pas pertama kali buka
    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. FUNGSI BARU BUAT UPLOAD GAMBAR 📸
    const handleUpload = async (orderId, file) => {
        if (!file) return; // Kalau gak ada file, diem aja

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file); // Harus 'image' sesuai backend
        formData.append('_method', 'POST'); 

        setUploading(true); // Mulai loading

        try {
            await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/pay`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Wajib buat file
                }
            });
            alert("Bukti terkirim! Tunggu Admin nge-cek ya.");
            fetchOrders(); // REFRESH DATA BIAR STATUS BERUBAH
        } catch (error) {
            console.error(error);
            alert("Gagal upload gambar, pastiin file gak kegedean.");
        } finally {
            setUploading(false); // Selesai loading
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1>Riwayat Pesanan 📜</h1>

            {orders.length === 0 && <p>Belum ada orderan nih.</p>}

            {orders.map((order) => (
                <div key={order.id} style={{ 
                    border: '1px solid #444', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    marginBottom: '20px',
                    backgroundColor: '#1e1e1e' 
                }}>
                    {/* HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3>Order #{order.id}</h3>
                        
                        {/* WARNA-WARNI STATUS */}
                        <span style={{ 
                            fontWeight: 'bold',
                            color: order.status === 'pending' ? 'orange' : 
                                   order.status === 'paid' ? '#00ff00' : '#00bfff' 
                        }}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>

                    {/* LIST BARANG */}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {order.items.map((item) => (
                            <li key={item.id} style={{ padding: '5px 0', borderBottom: '1px dashed #333' }}>
                                📦 {item.product?.name || 'Produk Dihapus'} (x{item.quantity})
                                <span style={{ float: 'right' }}>
                                    {/* Pake Optional Chaining biar aman */}
                                    @ Rp {item.price || item.product?.price}
                                </span>
                            </li>
                        ))}
                    </ul>
                    
                    <hr style={{ borderColor: '#444' }}/>
                    
                    {/* BAGIAN BAWAH: TOTAL & UPLOAD */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <h3>Total: Rp {order.total_price.toLocaleString()}</h3>

                        {/* 👇 LOGIC SAKTI: Cuma muncul kalo PENDING 👇 */}
                        {order.status === 'pending' && (
                            <div style={{textAlign: 'right'}}>
                                <p style={{fontSize: '12px', color: '#ccc', marginBottom: '5px'}}>Upload Bukti Transfer:</p>
                                <input 
                                    type="file" 
                                    disabled={uploading}
                                    onChange={(e) => handleUpload(order.id, e.target.files[0])}
                                    style={{ color: 'white' }}
                                />
                            </div>
                        )}

                        {order.status === 'waiting_verification' && (
                            <span style={{color: '#00bfff'}}>⏳ Menunggu Verifikasi Admin</span>
                        )}

                        {order.status === 'paid' && (
                            <span style={{color: '#00ff00'}}>✅ LUNAS</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}