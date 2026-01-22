import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    // Ambil data user
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Fungsi Logout
    const handleLogout = () => {
        localStorage.clear();
        alert("Dadah Broskie! 👋");
        navigate('/login');
        window.location.reload(); 
    };

    return (
        // 👇 DISINI KUNCI GLASS EFFECT NYA
        // fixed top-0: Nempel di atas layar
        // backdrop-blur-md: Efek burem kayak kaca
        // bg-black/60: Warna hitam transparan (60%)
        // border-b border-white/10: Garis tipis transparan di bawah
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/10 transition-all duration-300">
            
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* LOGO (Pake Font Anton biar senada sama Home) */}
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold font-['Anton'] tracking-wider text-white hover:text-yellow-400 transition duration-300 uppercase">
                        K!CK
                    </Link>
                </div>

                {/* MENU LINK */}
                <div className="flex items-center gap-6 font-semibold uppercase text-sm tracking-wide">
                    <Link to="/" className="text-white hover:text-yellow-400 transition">Home</Link>

                    {/* LOGIKA: Kalo udah Login */}
                    {token ? (
                        <>
                            {/* Tombol Dashboard Admin (Merah) */}
                            {user && user.role === 'admin' && (
                                <Link to="/admin" className="text-red-500 hover:text-red-400 font-bold transition">
                                    Dashboard
                                </Link>
                            )}
                            
                            <Link to="/history" className="text-white hover:text-yellow-400 transition">Riwayat</Link>

                            {/* Tombol Keranjang (Dibuat agak beda) */}
                            <Link to="/cart" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full transition text-white">
                                <span>Cart</span> 🛒
                            </Link>
                            
                            {/* Tombol Logout */}
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-bold transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        /* LOGIKA: Kalo Belum Login */
                        <>
                            <Link to="/login" className="text-white hover:text-yellow-400 transition">Login</Link>
                            <Link 
                                to="/register" 
                                className="bg-yellow-400 text-black px-5 py-2 rounded font-bold hover:bg-yellow-300 transition"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;