import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/register', {
                name,
                email,
                password
            });
            alert("Akun jadi! Sekarang Login dulu ya Broskie. 🚀");
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert("Gagal daftar. Email udah dipake kali?");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#101010] p-8 rounded-xl border border-gray-800 shadow-2xl">
                
                <h1 className="text-4xl font-['Anton'] uppercase text-center mb-2 tracking-wider">
                    Join The Gang
                </h1>
                <p className="text-gray-400 text-center mb-8 text-sm">Bikin akun biar gak ketinggalan drop terbaru.</p>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    
                    {/* Input Nama */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Username / Nama</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black border border-gray-700 p-3 text-white rounded focus:border-yellow-400 focus:outline-none transition"
                        />
                    </div>

                    {/* Input Email */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-700 p-3 text-white rounded focus:border-yellow-400 focus:outline-none transition"
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
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="mt-4 bg-white text-black py-3 font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition shadow-lg"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Udah punya akun? <Link to="/login" className="text-yellow-400 font-bold hover:underline">Login aja</Link>
                </p>
            </div>
        </div>
    );
}