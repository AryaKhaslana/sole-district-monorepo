<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // --- TAMBAHIN BARIS INI (MANTRA ANTI RIBET) ---
    // Artinya: "Gak ada yang dijaga, silakan isi semua kolom!"
    protected $guarded = []; 
    
    // Atau kalau mau ribet satu-satu (pilih salah satu aja):
    // protected $fillable = ['name', 'price', 'stock', 'description', 'image_url'];
}