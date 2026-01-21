import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Nembak API Register Laravel
            await axios.post('http://127.0.0.1:8000/api/register', {
                name: name,
                email: email,
                password: password,
                // role: 'USER' <-- Gak usah dikirim, biarin Backend yang set default jadi USER
            });

            alert("Pendaftaran Berhasil! Silakan Login 🥳");
            navigate('/login'); // Lempar ke halaman login

        } catch (error) {
            console.error("Gagal daftar:", error);
            // Cek kalau error validasi (misal email udah kepake)
            if (error.response && error.response.data.errors) {
                alert(Object.values(error.response.data.errors).flat().join('\n'));
            } else {
                alert("Gagal daftar broskie. Cek console.");
            }
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#1a1a1a', 
            color: 'white' 
        }}>
            <div style={{ 
                backgroundColor: '#2d2d2d', 
                padding: '40px', 
                borderRadius: '10px', 
                width: '350px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Daftar Akun Baru 🚀</h2>
                
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Nama Lengkap</label>
                        <input 
                            type="text" 
                            placeholder="Siapa nama lu?"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="email@contoh.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Rahasia donk"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: 'none' }}
                            required
                        />
                    </div>

                    <button type="submit" style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}>
                        DAFTAR SEKARANG
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
                    Udah punya akun? <Link to="/login" style={{ color: '#4da3ff' }}>Login disini</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;