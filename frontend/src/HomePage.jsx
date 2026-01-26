import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HeroSection from './components/HeroSection'; // 👈 Pastiin path ini bener!

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const addToCart = async (productId) => {
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert("Eits, Login dulu bos!");
            return;
        }
        await axios.post('http://127.0.0.1:8000/api/cart', {
            product_id: productId,
            quantity: 1
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Berhasil masuk keranjang! 🛒");
    } catch (error) {
        console.error(error);
        alert("Gagal nambahin barang. Stok abis kali?");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  return (
    <div className="bg-black min-h-screen text-white">
      
      {/* 1. HERO SECTION (Wajib ada biar gak kosong melompong) */}
      <HeroSection /> 

      {/* 2. BAGIAN PRODUK */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* JUDUL CENTER 🔥 */}
        <h2 className="text-5xl font-bold italic uppercase mb-12 font-['Anton'] tracking-wider text-center text-yellow-400 drop-shadow-md">
          Hot Drops 🔥
        </h2>

        {/* CONTAINER FLEX (Rata Tengah) */}
        <div className="flex flex-wrap justify-center gap-8">
          
          {products?.data?.map((item) => (
            
            // KARTU PRODUK
            <div 
              key={item.id} 
              className="group border border-gray-800 hover:border-yellow-400 transition-all duration-300 bg-[#101010] w-full md:w-[30%] flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/20"
            >
              
              {/* GAMBAR (Aspect Ratio biar kotak rapi) */}
              <div className="aspect-square overflow-hidden relative bg-gray-900">
                 <img 
                   src={getImageUrl(item.image_url)} 
                   alt={item.name}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                 
                 {item.stock < 5 && (
                   <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 font-bold z-10 rounded-full shadow-md">
                     LIMITED STOCK
                   </span>
                 )}
              </div>
              
              {/* INFO PRODUK (Center Alignment) */}
              <div className="p-6 flex flex-col items-center text-center flex-grow">
                 
                 {/* Nama & Harga */}
                 <div className="mb-4">
                   <h3 className="text-2xl font-bold uppercase font-['Anton'] tracking-wide text-white mb-2 leading-snug">
                      {item.name}
                   </h3>
                   <p className="text-yellow-400 font-mono text-xl font-bold">
                      Rp {item.price.toLocaleString('id-ID')}
                   </p>
                 </div>
                 
                 {/* Tombol Action (Full Width biar gagah) */}
                 <div className="w-full flex gap-3 mt-auto">
                   <Link 
                      to={`/product/${item.id}`} 
                      className="flex-1 text-center border border-white py-3 hover:bg-white hover:text-black transition font-bold uppercase tracking-wider text-sm rounded"
                   >
                      Detail
                   </Link>
                   <button 
                      onClick={() => addToCart(item.id)}
                      className="flex-1 bg-yellow-400 text-black border border-yellow-400 py-3 hover:bg-yellow-300 transition font-bold uppercase tracking-wider text-sm rounded"
                   >
                      + Cart
                   </button>
                 </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}