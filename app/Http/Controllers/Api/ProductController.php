<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // LIHAT SEMUA BARANG (Public)
    public function index()
    {
        return response()->json(Product::all());
    }

    // LIHAT DETAIL BARANG (Public)
    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Barang gaib alias gak ada.'], 404);
        return response()->json($product);
    }

    // --- FITUR ADMIN DI BAWAH INI ---

    // TAMBAH BARANG (Admin Only)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048' // Max 2MB
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            // Simpan gambar ke folder 'public/products'
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = url('storage/' . $path); // Simpan Link Lengkapnya
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'image_url' => $imageUrl
        ]);

        return response()->json(['message' => 'Barang baru ditambahkan!', 'data' => $product]);
    }
    
    // UPDATE & DELETE bisa lo tambahin sendiri polanya sama kayak store
}