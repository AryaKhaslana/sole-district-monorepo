<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    // LIAT KERANJANG
    public function index(Request $request)
    {
        $user = $request->user();
        // Pastiin cuma ambil yang user_id nya sama kayak yang login
        $cart = Cart::with('product')->where('user_id', $user->id)->get();
        return response()->json($cart);
    }

    // TAMBAH KE KERANJANG
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = $request->user();

        // Cek udah ada belum barangnya, kalau ada update jumlahnya
        $existingCart = Cart::where('user_id', $user->id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($existingCart) {
            $existingCart->quantity += $request->quantity;
            $existingCart->save();
        } else {
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json(['message' => 'Masuk keranjang bos!']);
    }

    // HAPUS DARI KERANJANG
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        // Pastiin yang dihapus punya dia sendiri
        $cart = Cart::where('user_id', $user->id)->where('id', $id)->first();
        
        if ($cart) {
            $cart->delete();
            return response()->json(['message' => 'Dihapus bos!']);
        }
        
        return response()->json(['message' => 'Barang ga ketemu'], 404);
    }
}