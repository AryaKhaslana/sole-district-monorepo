import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams(); // Ambil ID dari URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null); // State buat nyimpen ukuran yang dipilih

  // Dummy Size (Nanti bisa diambil dari DB kalo udah canggih)
  const sizes = [39, 40, 41, 42, 43, 44];

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`)
      .then(response => {
        setProduct(response.data); // Sesuaikan struktur response Laravel
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const addToCart = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Login dulu dong, Broskie! 😅");
            return;
        }
        
        // Validasi Size (Opsional, buat gaya-gayaan UI)
        if (!selectedSize) {
            alert("Pilih ukuran sepatu dulu bos! 👟");
            return;
        }

        await axios.post('http://127.0.0.1:8000/api/cart', {
            product_id: product.id,
            quantity: 1
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert(`Berhasil bungkus size ${selectedSize}! 🛒`);
    } catch (error) {
        console.error(error);
        alert("Gagal masuk keranjang.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/600x600';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Sepatu Keren...</div>;
  if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Barang Ghaib (Tidak Ditemukan) 👻</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* TOMBOL BACK (Sticky di pojok kiri atas) */}
      <Link to="/" className="fixed top-6 left-6 z-50 bg-white text-black px-4 py-2 font-bold uppercase tracking-widest hover:bg-yellow-400 transition shadow-lg rounded-sm">
        ← Back
      </Link>

      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* KOLOM KIRI: GAMBAR (Sticky) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-[#101010] relative sticky top-0">
          <img 
            src={getImageUrl(product.image_url)} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* KOLOM KANAN: DETAIL INFO (Scrollable) */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          
          {/* Kategori Kecil */}
          <span className="text-yellow-400 font-mono tracking-widest mb-2">EXCLUSIVE DROP</span>
          
          {/* Nama Produk */}
          <h1 className="text-5xl md:text-7xl font-bold uppercase font-['Anton'] leading-none mb-6">
            {product.name}
          </h1>

          {/* Harga */}
          <p className="text-3xl font-mono border-b border-gray-800 pb-6 mb-6">
            Rp {product.price.toLocaleString('id-ID')}
          </p>

          {/* Deskripsi */}
          <div className="text-gray-400 leading-relaxed mb-8">
            <p>{product.description || "Deskripsi belum diisi sama Admin males. Tapi percayalah ini sepatu keren banget, bisa bikin lu terbang (kalau dilempar)."}</p>
          </div>

          {/* PILIH SIZE (DUMMY UI) */}
          <div className="mb-8">
            <p className="font-bold uppercase tracking-widest mb-3 text-sm text-gray-300">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border flex items-center justify-center font-bold transition-all
                    ${selectedSize === size 
                      ? 'bg-white text-black border-white scale-110' // Style pas dipilih
                      : 'bg-transparent text-gray-400 border-gray-700 hover:border-white hover:text-white'} // Style default
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* TOMBOL ACTION */}
          <div className="flex gap-4">
            <button 
              onClick={addToCart}
              className="flex-1 bg-yellow-400 text-black py-4 font-bold uppercase tracking-widest hover:bg-yellow-300 transition shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
            >
              Add to Cart — Rp {product.price.toLocaleString()}
            </button>
          </div>
          
          {/* Info Tambahan */}
          <p className="mt-6 text-xs text-gray-500 text-center uppercase tracking-widest">
            Free Shipping • 100% Authentic • No Returns
          </p>

        </div>
      </div>
    </div>
  );
}