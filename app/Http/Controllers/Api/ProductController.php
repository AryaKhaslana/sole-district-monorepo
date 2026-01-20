<?php

namespace App\Http\Controllers\Api; // <--- PASTIKAN INI BENAR

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // LIHAT SEMUA BARANG (Public)
    public function index(Request $request)
    {
        $query = Product::query();

        if($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        }

        $products = $query->paginate(10);
        return response()->json($products);
    }

    // TAMBAH BARANG (Admin Only)
    public function store(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        $imagePath = null; 
        
        // 2. Cek ada gambar gak?
        if ($request->hasFile('image')) {
            // Simpan ke storage/app/public/products
            $imagePath = $request->file('image')->store('products', 'public');
        }

        // 3. Simpan ke Database
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            
            // PENTING: Pake 'image' sesuai database lu!
            'image' => $imagePath 
        ]);
            
        return response()->json([
            'message' => 'Barang baru ditambahkan!', 
            'data' => $product
        ]);
    }
    
    // LIHAT DETAIL (Show)
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // UPDATE & DELETE (Jangan lupa tambahin method delete buat AdminPage lu)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Hapus gambar lama kalau ada
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->delete();
        return response()->json(['message' => 'Produk dihapus']);
    }
}