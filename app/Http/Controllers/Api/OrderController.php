<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessCheckout;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Buat Transaction

class OrderController extends Controller
{

    public function index(Request $request) {

        $user = $request->user();

        if ($user->role === 'admin') {
            $orders = Order::with('items.product')->orderBy('created_at', 'desc')->get();
        } else {
            $orders = Order::with('items.product') -> where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        }

        return response()->json($orders);
    }

    // 1. CHECKOUT (User Beli Barang)
    public function store(Request $request)
    {
       $user = $request->user();
        
        // 1. Ambil semua isi keranjang user
        $cartItems = Cart::where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Keranjang kosong bro!'], 400);
        }

        return DB::transaction(function () use ($user, $cartItems) {
            $totalPrice = 0;
            $orderItemsData = [];

            // 2. Looping isi keranjang buat dipindah ke Order
            foreach ($cartItems as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);

                if (!$product || $product->stock < $item->quantity) {
                    throw new \Exception("Stok {$product->name} abis atau kurang bro!");
                }

                // Kurangi Stok
                $product->stock -= $item->quantity;
                $product->save();

                // Hitung Subtotal
                $subtotal = $product->price * $item->quantity;
                $totalPrice += $subtotal;

                // Siapin data order_items
                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'price_at_purchase' => $product->price,
                ];
            }

            // 3. Bikin Order Utama
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $totalPrice,
                'status' => 'pending'
            ]);

            // 4. Masukin detail barang
            foreach ($orderItemsData as $data) {
                $order->items()->create($data);
            }

            // 5. PENTING: KOSONGIN KERANJANG!! 🗑️
            Cart::where('user_id', $user->id)->delete();

            ProcessCheckout::dispatch();

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