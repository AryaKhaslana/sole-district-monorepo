import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

// Di dalam return (...)
export default function CartPage () {
    const [cartItems, setCartItems] = useState([]);
    
    const AmbilDataKeranjang = () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('login dulu bos')
            Navigate('/login')
            return;
        }
        
        axios.get("http://127.0.0.1:8000/api/cart", {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((response) => {
            setCartItems(response.data);
        })
        .catch((error) => {
            console.error("Gagal ambil data", error);
        });
    };
    
        useEffect (() => {
           AmbilDataKeranjang();
        }, []);
    
    const HandleBeli = (id) => {
        const token = localStorage.getItem('token');

        axios.delete(`http://127.0.0.1:8000/api/cart/${id}`, {
            headers: {Authorization: `Bearer: ${token}`}
        })
        .then(() => {
            alert('dah ilang barangnya');
            AmbilDataKeranjang();
        })
        .catch((err) => console.error(err));
    }

    const HandleCheckout = () => {
        if (!confirm("Yakin kamu mau checkout semua barang ini ?")) return;

        const token = localStorage.getItem('token');

        axios.post("http://127.0.0.1:8000/api/checkout", 
        {}, 
        {
            headers: {Authorization: `Bearer ${token}`}
        }
    )
    .then((response) => {
        alert(response.data.message);

         AmbilDataKeranjang();
    })
    .catch((error) => {
            console.error("Error checkout nih", error);

            if (error.response && error.response.status === 401) {
                alert('sesi habis, login lagi');
            } else {
                alert("gagal checkout broskie");
            }
        });
    };

    const GrandTotal = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    return (
<div>
    <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
        <tr style={{ background: "#f0f0f0" }}>
            <th>Produk</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Total</th>
            <th>aksi</th>
        </tr>
    </thead>
    <tbody>
        {/* LOOPING DATA */}
        {cartItems.map((item) => (
            <tr key={item.id}>
                {/* 1. Nama Produk (Nyelem ke dalem object 'product') */}
                <td>
                    <b>{item.product.name}</b>
                    <br/>
                    <small>ID Produk: {item.product_id}</small>
                </td>

                {/* 2. Harga Satuan */}
                <td>Rp {item.product.price}</td>

                {/* 3. Jumlah Beli */}
                <td>{item.quantity} pcs</td>

                {/* 4. HITUNGAN MATEMATIKA (Harga x Jumlah) */}
                <td>
                    Rp {item.product.price * item.quantity}
                </td>
                <td>
                <button 
                onClick={() => HandleBeli(item.id)} // <--- Kirim ID keranjang
                style={{ backgroundColor: 'red', color: 'white' }}
                 >
                    Hapus 🗑️
                </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

<div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Total Belanja: Rp {GrandTotal}</h3>
                
            <button 
            onClick={HandleCheckout}
            style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '10px 20px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px'
            }}>
                Checkout Sekarang 💸
            </button>
        </div>
</div>
    );
}
