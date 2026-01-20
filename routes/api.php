<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

// --- PUBLIC ROUTES (Bisa diakses siapa aja) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']); // Liat Barang
Route::get('/products/{id}', [ProductController::class, 'show']); // Detail Barang

// --- PROTECTED ROUTES (Harus Login & Admin) ---
// Pastikan middleware 'is_admin' lu beneran jalan
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);

    // ADMIN PRODUCTS MANAGEMENT
    Route::post('/products', [ProductController::class, 'store']); // Create (POST)
    Route::post('/products/{id}/update', [ProductController::class, 'update']); // Update (Pake POST buat file)
    Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Delete (WAJIB DELETE)

    // ORDER MANAGEMENT
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/{id}/verify', [OrderController::class, 'verifyPayment']); // Acc Bayaran
});

// --- USER ROUTES (Login tapi bukan Admin) ---
// Kalau lu butuh fitur User biasa (Checkout/Cart), taruh di grup middleware terpisah
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cart', [CartController::class, 'store']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::post('/orders/{id}/upload', [OrderController::class, 'uploadProof']); 
});