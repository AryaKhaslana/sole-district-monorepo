import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 

        try {
            // Tembak API Login yang udah lo siapin di Backend
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email: email,
                password: password
            });

            // Ambil Token & Data User dari respon Backend
            const { token, user } = response.data;

            // SIMPAN KUNCI (TOKEN) DI SAKU BROWSER
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login Berhasil! Welcome, " + user.name + " 👋");
            
            // Pindah ke Halaman Utama
            navigate("/"); 
            // Refresh biar Navbar sadar kalau kita udah login
            window.location.reload(); 

        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Gagal! Cek email atau password lo.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <div style={{ padding: '30px', border: '1px solid #555', borderRadius: '10px', width: '350px', backgroundColor: '#222' }}>
                <h2 style={{ textAlign: 'center', color: '#fff' }}>Login Dulu Bro 🔐</h2>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div>
                        <label style={{ color: '#ccc' }}>Email:</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }}
                            placeholder="Contoh: admin@toko.com"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ color: '#ccc' }}>Password:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }}
                            placeholder="******"
                            required
                        />
                    </div>

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                        MASUK SEKARANG 🚀
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '13px', textAlign: 'center', color: '#aaa' }}>
                    Belum punya akun? <a href="/register" style={{ color: '#4da3ff' }}>Daftar di sini</a> (Nanti kita bikin)
                </p>
            </div>
        </div>
    );
}