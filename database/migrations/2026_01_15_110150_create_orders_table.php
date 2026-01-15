<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Siapa yang beli
        $table->decimal('total_price', 12, 2);
        $table->string('payment_proof')->nullable(); // Foto Bukti Transfer
        // Status Pesanan:
        // pending = Baru checkout, belum bayar
        // waiting_verification = Udah upload bukti, nunggu admin cek
        // paid = Admin udah acc, barang siap kirim
        // cancelled = Batal
        $table->enum('status', ['pending', 'waiting_verification', 'paid', 'cancelled'])->default('pending');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
