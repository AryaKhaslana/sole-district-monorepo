<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    public function checkout() {
        return DB::transaction(function() {

            $carts = Cart::with('product')->get();

            if ($carts -> isEmpty()) {
                return response()->json(['message' => 'keranjang kosong bro']);
            }

            $total = 0;
            foreach ($carts as $cart) {
                $total += ($cart -> product->price * $cart->quantity);
            }

            $order = order::create([
                'user_id' => 1,
                'total_price' => $total,
                'status' => 'pending',
            ]);

            foreach ($carts as $cart) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cart->product_id,
                    'quantity' => $cart->quantity,
                    'price' => $cart->product->price,
                ]);
                $cart->product->decrement('stock', $cart->quantity);
            }

            Cart::truncate();

            return response()->json([
                'message' => 'transaksi berhasil',
                'order_id' => $order->id,
            ]);
            
        });
    }
}
