import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  // Ambil Data Keranjang pas halaman dibuka
  useEffect(() => {
    fetchCart();
  }, []);

  // Hitung Total Harga setiap kali cartItems berubah
  useEffect(() => {
    let total = 0;
    cartItems.forEach(item => {
      // Pastikan ada product-nya biar gak error
      if(item.product) {
        total += item.product.price * item.quantity;
      }
    });
    setTotalPrice(total);
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Asumsi backend lu ngembaliin data cart beserta relasi product-nya
      // Contoh response: [{id: 1, quantity: 2, product: {name: 'Sepatu', price: 1000, ...}}]
      const response = await axios.get('http://127.0.0.1:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartItems(response.data); // Sesuaikan sama struktur API lu (misal response.data.data)
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil cart:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (cartId) => {
    if(!confirm("Yakin mau buang barang keren ini? 😢")) return;
    
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/cart/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Hapus dari state biar gak perlu refresh halaman
        setCartItems(cartItems.filter(item => item.id !== cartId));
    } catch (error) {
        alert("Gagal hapus barang.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) return <div className="min-h-screen bg-black text-white pt-32 text-center">Loading Keranjang Sultan...</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-10 px-4">
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-['Anton'] uppercase mb-8 tracking-wider">
          Your Cart <span className="text-yellow-400">({cartItems.length})</span>
        </h1>

        {cartItems.length === 0 ? (
            // TAMPILAN KALO KOSONG
            <div className="text-center py-20 bg-[#101010] border border-gray-800 rounded-xl">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold mb-2">Keranjang Masih Kosong Broskie!</h2>
                <p className="text-gray-400 mb-6">Masa sultan keranjangnya kosong? Gas belanja dulu.</p>
                <Link to="/" className="bg-yellow-400 text-black px-8 py-3 font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition">
                    Shop Now
                </Link>
            </div>
        ) : (
            // TAMPILAN ADA ISINYA (Split Layout)
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* KIRI: LIST BARANG */}
                <div className="w-full md:w-2/3 flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-[#101010] border border-gray-800 rounded-xl items-center hover:border-gray-600 transition">
                            
                            {/* Gambar Kecil */}
                            <div className="w-24 h-24 bg-gray-900 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                    src={getImageUrl(item.product?.image_url)} 
                                    alt={item.product?.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info Produk */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold font-['Anton'] uppercase tracking-wide">
                                    {item.product?.name}
                                </h3>
                                <p className="text-gray-400 text-sm mb-2">Quantity: {item.quantity}</p>
                                <p className="text-yellow-400 font-mono font-bold">
                                    Rp {(item.product?.price * item.quantity).toLocaleString('id-ID')}
                                </p>
                            </div>

                            {/* Tombol Hapus (Sampah) */}
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition"
                                title="Hapus Barang"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* KANAN: SUMMARY (Sticky) */}
                <div className="w-full md:w-1/3">
                    <div className="bg-[#101010] border border-gray-800 p-6 rounded-xl sticky top-28">
                        <h3 className="text-2xl font-['Anton'] uppercase mb-6 border-b border-gray-800 pb-4">
                            Order Summary
                        </h3>
                        
                        <div className="flex justify-between mb-4 text-gray-400">
                            <span>Subtotal</span>
                            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-400">
                            <span>Tax (Pajak Jadian)</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="flex justify-between mb-8 text-xl font-bold text-white border-t border-gray-800 pt-4">
                            <span>Total</span>
                            <span className="text-yellow-400">Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>

                        <button 
                            onClick={() => alert("Fitur Checkout nyusul ya Broskie! Duitnya abis buat beli Seblak. 🤣")}
                            className="w-full bg-yellow-400 text-black py-4 font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition shadow-lg"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>

            </div>
        )}

      </div>
    </div>
  );
}