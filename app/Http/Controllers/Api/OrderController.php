<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Buat Transaction

class OrderController extends Controller
{
    // 1. CHECKOUT (User Beli Barang)
    public function store(Request $request)
    {
        // Validasi: Pastikan data 'items' dikirim dari Frontend
        // Bentuk JSON yg dikirim Frontend harus gini: 
        // { "items": [ {"product_id": 1, "quantity": 2}, {"product_id": 3, "quantity": 1} ] }
        
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Pake DB Transaction: Kalau satu gagal, semua batal (Biar stok gak selisih)
        return DB::transaction(function () use ($request) {
            $totalPrice = 0;
            $orderItemsData = [];

            // Looping barang belanjaan
            foreach ($request->items as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']); // Kunci stok biar gak rebutan

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->name} habis bro! Sisa {$product->stock}");
                }

                // Kurangi Stok
                $product->stock -= $item['quantity'];
                $product->save();

                // Hitung Subtotal
                $subtotal = $product->price * $item['quantity'];
                $totalPrice += $subtotal;

                // Siapin data buat tabel order_items
                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price_at_purchase' => $product->price,
                ];
            }

            // Bikin Order Utama
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => 'pending' // Belum bayar
            ]);

            // Masukin detail barang ke database
            foreach ($orderItemsData as $data) {
                $order->items()->create($data); // Pastikan di Model Order ada relasi hasMany 'items'
            }

            return response()->json([
                'message' => 'Order berhasil! Silakan transfer.',
                'order_id' => $order->id,
                'total' => $totalPrice
            ], 201);
        });
    }

    // 2. UPLOAD BUKTI TRANSFER (User)
    public function uploadProof(Request $request, $id)
    {
        $request->validate(['image' => 'required|image|max:2048']);
        
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);
        
        $path = $request->file('image')->store('payment_proofs', 'public');
        
        $order->update([
            'payment_proof' => url('storage/' . $path),
            'status' => 'waiting_verification'
        ]);

        return response()->json(['message' => 'Bukti diterima, tunggu admin cek ya!']);
    }

    // 3. VERIFIKASI PEMBAYARAN (Admin Only)
    public function verifyPayment($id)
    {
        // Harusnya ada cek: if (auth()->user()->role !== 'admin') abort(403);
        
        $order = Order::findOrFail($id);
        $order->update(['status' => 'paid']); // Status jadi LUNAS

        return response()->json(['message' => 'Pembayaran dikonfirmasi! Barang siap kirim.']);
    }
}