import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null); // Buat nyimpen file gambar
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // Ambil data user dari localstorage terus di-parse jadi objek
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchProducts = async() => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products');
            // Sesuaikan sama struktur API lu (response.data.data atau response.data)
            setProducts(response.data.data); 
        } catch (error) {
            console.error("Gagal ambil data", error);
        }
    };

    console.log("CEK DATA USER:", user);

    // 1. CEK APAKAH DIA ADMIN?
    useEffect(() => {
        if (!token || !user || user.role !== 'admin') {
            alert("MAU NGAPAIN? LU BUKAN ADMIN! 👮‍♂️");
            navigate('/'); // Tendang ke Home
        } else {
            fetchProducts();
        }
    }, []);

    // 2. AMBIL DATA PRODUK

    // 3. FITUR TAMBAH PRODUK (CREATE)
    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        // PENTING: Karena ada FILE GAMBAR, kita wajib pake FormData
        // Gak bisa pake JSON biasa ({ name: name })
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Bawa Token Admin
                    'Content-Type': 'multipart/form-data' // Wajib buat upload file
                }
            });
            alert("Mantap! Produk berhasil ditambah! 🛍️");
            fetchProducts(); // Refresh tabel biar produk baru muncul
            // Reset form
            setName(''); setPrice(''); setStock(''); setDescription('');
        } catch (error) {
            console.error(error);
            alert("Gagal nambah produk. Cek console.");
        }
    };

    // 4. FITUR HAPUS PRODUK (DELETE)
    const handleDelete = async (id) => {
        if (confirm("Yakin mau hapus barang ini? Ilang beneran loh!")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts(); // Refresh tabel
            } catch (error) {
                alert("Gagal hapus bro.");
            }
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <h1>👮‍♂️ Dashboard Admin</h1>
            <p>Selamat datang, Bos <b>{user?.name}</b>!</p>
            <hr />

            <div style={{ display: 'flex', gap: '50px' }}>
                
                {/* KIRI: FORM TAMBAH BARANG */}
                <div style={{ flex: 1, background: '#000000', padding: '20px', borderRadius: '10px' }}>
                    <h3>➕ Tambah Barang Baru</h3>
                    <form onSubmit={handleAddProduct}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Nama Produk:</label><br/>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Harga (Rp):</label><br/>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Stok:</label><br/>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Deskripsi:</label><br/>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }}></textarea>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Gambar:</label><br/>
                            {/* Input File beda sendiri cara ambil datanya */}
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <button type="submit" style={{ background: 'green', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                            Simpan Produk
                        </button>
                    </form>
                </div>

                {/* KANAN: LIST BARANG */}
                <div style={{ flex: 2 }}>
                    <h3>📦 List Gudang</h3>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#333', color: 'white' }}>
                                <th>Nama</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id} style={{ textAlign: 'center' }}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.stock}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                        >
                                            Hapus 🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminPage;