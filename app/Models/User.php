<?php

namespace App\Models;

// 1. TAMBAHIN BARIS INI (Import Skill)
use Laravel\Sanctum\HasApiTokens; 

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // 2. TAMBAHIN 'HasApiTokens' DI DALAM SINI
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Pastiin ini ada juga biar gak error pas register
    ];
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // ... sisa kodingan bawahnya biarin aja
}