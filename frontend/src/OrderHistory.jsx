import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    
    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        if(!token) {
            alert("Login dulu bro biar bisa liat riwayat");
            navigate('/login');
            return;
        }

        axios.get("http://127.0.0.1:8000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            // Asumsi response Laravel: { data: [...] } atau langsung [...]
            // Gw kasih .data || res.data buat jaga-jaga
            setOrders(res.data.data || res.data); 
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpload = async (orderId, file) => {
        if (!file) return; 
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file); 
        formData.append('_method', 'POST'); 

        setUploading(true); 

        try {
            // Endpoint Upload Bukti Bayar
            await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/pay`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            alert("Bukti terkirim! Admin lagi ngecek nih. 🕵️‍♂️");
            fetchOrders(); 
        } catch (error) {
            console.error(error);
            alert("Gagal upload gambar. Kegedean kali filenya?");
        } finally {
            setUploading(false); 
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white pt-32 text-center">Loading Riwayat...</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-['Anton'] uppercase mb-8 tracking-wider">
                    Riwayat Pesanan 📜
                </h1>

                {orders.length === 0 ? (
                     <div className="text-center py-16 border border-gray-800 rounded-xl bg-[#101010]">
                        <p className="text-gray-400 mb-4">Belum ada orderan nih.</p>
                        <button onClick={() => navigate('/')} className="text-yellow-400 font-bold hover:underline">
                            Gas Belanja Dulu!
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-[#101010] border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition shadow-lg">
                                
                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    
                                    {/* STATUS BADGE */}
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase 
                                        ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                          order.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* LIST BARANG */}
                                <div className="space-y-3 mb-6">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-300">
                                                📦 {item.product?.name || 'Produk Dihapus'} <span className="text-gray-500">(x{item.quantity})</span>
                                            </span>
                                            <span className="text-gray-400 font-mono">
                                                Rp {(item.price || item.product?.price).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* FOOTER: TOTAL & UPLOAD */}
                                <div className="flex flex-col md:flex-row justify-between items-center bg-black/30 p-4 rounded-lg">
                                    <h3 className="text-xl font-bold font-mono text-white mb-4 md:mb-0">
                                        Total: <span className="text-yellow-400">Rp {order.total_price.toLocaleString()}</span>
                                    </h3>

                                    {/* TOMBOL UPLOAD (Hanya kalo Pending) */}
                                    {order.status === 'pending' && (
                                        <div className="flex flex-col items-end gap-2">
                                            <label className="text-xs text-gray-400 uppercase font-bold">Upload Bukti Transfer</label>
                                            <input 
                                                type="file" 
                                                disabled={uploading}
                                                onChange={(e) => handleUpload(order.id, e.target.files[0])}
                                                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 cursor-pointer"
                                            />
                                            {uploading && <span className="text-xs text-yellow-400 animate-pulse">Mengupload...</span>}
                                        </div>
                                    )}

                                    {order.status === 'paid' && <span className="text-green-500 font-bold">✅ PEMBAYARAN DITERIMA</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}