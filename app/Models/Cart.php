<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // 👇 INI WAJIB ADA! KALAU GAK ADA, SERVER CRASH.
    protected $fillable = [
        'user_id', 
        'product_id', 
        'quantity'
    ];

    // Relasi ke Produk (biar bisa with('product'))
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    // Relasi ke User (Opsional)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}