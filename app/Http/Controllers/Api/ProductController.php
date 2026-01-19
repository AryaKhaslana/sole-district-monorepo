<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use GuzzleHttp\Psr7\Query;
use Illuminate\Http\Request;
use illuminate\View\View;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\String\ByteString;

use function Laravel\Prompts\search;

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
            // LIHAT DETAIL BARANG (Public)
            public function show($id)
            {
                $product = Product::findOrFail($id);
                return response()-> json($product);
            }
}