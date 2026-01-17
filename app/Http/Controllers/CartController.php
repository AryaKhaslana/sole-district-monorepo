<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existingItem = Cart::where('product_id', $request->product_id)->first();

        if ($existingItem) {
            $existingItem->increment('quantity');
            $pesan = 'jumlah barang ditambah' ;
        } else {
            Cart::create([
                'product_id'=> $request->product_id,
                'quantity'=> 1
            ]);
            $pesan = "barang berhasil ditambahkan";
        }

        return response()->json([
            'message' => $pesan,
        ], 201);
    }
}
