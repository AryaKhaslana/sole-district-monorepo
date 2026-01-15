<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = []; // <--- MANTRA WAJIB

    // Ini biar Order tau dia punya banyak Item
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}