<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_purchase', // <--- PASTIIN INI ADA
    ];

    // Relasi balik ke Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}