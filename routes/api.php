<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\CartController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/cart', [CartController::class, 'store']);

// Protected (Harus Login)
Route::middleware('auth:sanctum')->group(function () {
Route::post('/logout', [AuthController::class, 'logout']);

// User Order Actions
Route::post('/checkout', [OrderController::class, 'store']); // Beli
Route::post('/orders/{id}/upload', [OrderController::class, 'uploadProof']); // Upload Bukti

// Admin Actions
Route::post('/products', [ProductController::class, 'store']); // Tambah Barang
Route::post('/orders/{id}/verify', [OrderController::class, 'verifyPayment']); // Acc Bayaran
});
