import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. CEK ADMIN & AMBIL DATA
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        // Proteksi: Kalo bukan admin, tendang!
        if (!token || user?.role !== 'admin') {
            alert("Eits! Anda bukan Admin. Dilarang masuk area terlarang! ⛔");
            navigate('/');
            return;
        }

        fetchOrders();
    }, []);

    // 2. FUNGSI AMBIL DATA (Pake Endpoint Lama Lu: /api/orders)
    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            // 👇 KITA BALIKIN PAKE ENDPOINT LAMA LU BIAR GAK ERROR
            const response = await axios.get('http://127.0.0.1:8000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle response Laravel (kadang dibungkus .data, kadang enggak)
            setOrders(response.data.data || response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert("Gagal ambil data order.");
            setLoading(false);
        }
    };

    // 3. FUNGSI VERIFIKASI (Pake Logic Lama Lu: /verify)
    const handleVerifyPayment = async (orderId) => {
        if (!confirm("Yakin duitnya udah masuk rekening? 💸")) return;

        const token = localStorage.getItem('token');
        try {
            // 👇 PAKE ENDPOINT VERIFY LAMA LU
            await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/verify`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Pesanan Diterima! Status berubah jadi PAID ✅");
            fetchOrders(); // Refresh tabel
        } catch (error) {
            console.error(error);
            alert("Gagal verifikasi bro. Cek backend.");
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000/storage/${path}`;
    };

    if (loading) return <div className="min-h-screen bg-black text-white pt-32 text-center">Loading Data Bos...</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-['Anton'] uppercase tracking-wider text-red-500">
                        Admin Dashboard 👮‍♂️
                    </h1>
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition"
                    >
                        Logout
                    </button>
                </div>

                {/* TABEL GANTENG */}
                <div className="overflow-x-auto bg-[#101010] border border-gray-800 rounded-xl shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Bukti TF</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-900 transition">
                                    
                                    {/* ID */}
                                    <td className="p-4 font-mono text-gray-500">#{order.id}</td>
                                    
                                    {/* USER */}
                                    <td className="p-4">
                                        <div className="font-bold text-white">{order.user?.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </td>

                                    {/* ITEMS (List Barang) */}
                                    <td className="p-4 text-sm text-gray-300">
                                        <ul className="list-disc pl-4">
                                            {order.items?.map(item => (
                                                <li key={item.id}>
                                                    {item.product?.name} <span className="text-gray-500">(x{item.quantity})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* TOTAL */}
                                    <td className="p-4 font-mono text-yellow-400 font-bold">
                                        Rp {order.total_price.toLocaleString()}
                                    </td>

                                    {/* BUKTI BAYAR */}
                                    <td className="p-4">
                                        {order.payment_proof ? (
                                            <div className="group relative w-16 h-16">
                                                <img 
                                                    src={getImageUrl(order.payment_proof)} 
                                                    alt="Bukti" 
                                                    className="w-full h-full object-cover rounded border border-gray-600 cursor-pointer"
                                                />
                                                {/* Link buat buka full size */}
                                                <a 
                                                    href={getImageUrl(order.payment_proof)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white rounded transition"
                                                >
                                                    Zoom 🔍
                                                </a>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 text-xs italic">Belum Upload</span>
                                        )}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                              order.status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                                              order.status === 'waiting_verification' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>

                                    {/* ACTION BUTTON (ACC) */}
                                    <td className="p-4">
                                        {order.status === 'waiting_verification' || order.status === 'pending' ? (
                                            <button 
                                                onClick={() => handleVerifyPayment(order.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition shadow-lg w-full"
                                            >
                                                Verifikasi ✅
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 text-xs">Selesai</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}