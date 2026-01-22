import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password
            });

            // Simpan Token & User Data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert("Welcome Back, Sultan! 😎");
            navigate('/'); // Balik ke Home
            window.location.reload(); // Refresh biar Navbarnya update
        } catch (error) {
            console.error(error);
            alert("Email atau Password salah! Jangan ngasal dong.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#101010] p-8 rounded-xl border border-gray-800 shadow-2xl">
                
                <h1 className="text-4xl font-['Anton'] uppercase text-center mb-2 tracking-wider">
                    Login Area
                </h1>
                <p className="text-gray-400 text-center mb-8 text-sm">Masuk buat nge-cop sepatu impian lu.</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    
                    {/* Input Email */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-700 p-3 text-white rounded focus:border-yellow-400 focus:outline-none transition"
                            placeholder="sultan@broskie.com"
                        />
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-gray-700 p-3 text-white rounded focus:border-yellow-400 focus:outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="mt-4 bg-yellow-400 text-black py-3 font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition shadow-lg"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Belum punya akun? <Link to="/register" className="text-yellow-400 font-bold hover:underline">Daftar dulu sini</Link>
                </p>
            </div>
        </div>
    );
}