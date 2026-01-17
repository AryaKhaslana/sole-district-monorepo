import { useState, useEffect } from "react";
import axios from "axios";

// Di dalam return (...)
export default function CartPage () {
    const [cartItems, setCartItems] = useState([]);

    useEffect (() => {
        axios.get('http://127.0.0.1:8000/api/cart')
        .then((response) => {
            setCartItems(response.data);
        })
        .catch((err) => console.error(err));
    }, []);

    const AmbilDataKeranjang = () => {
        axios.get("http://127.0.0.1:8000/api/cart")
            .then((response) => {
                setCartItems(response.data);
            })
            .catch((error) => {
                console.error("Gagal ambil data", error);
            });
    };


    return (
    <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
        <tr style={{ background: "#f0f0f0" }}>
            <th>Produk</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Total</th>
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
            </tr>
        ))}
    </tbody>
</table>
    );
}
