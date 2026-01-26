<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order; // Sesuaikan Model Order lu
use Midtrans\Config;
use Midtrans\Snap;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        // 1. Set Konfigurasi Midtrans
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');

        // 2. Buat Data Order (Contoh Hardcode dulu biar paham)
        // Nanti lu ganti ini pake data dari Database/Keranjang
        $orderId = 'ORDER-' . time(); // ID Unik
        $grossAmount = 50000; // Harga Total

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => 'Broskie',
                'email' => 'broskie@gmail.com',
                'phone' => '081234567890',
            ],
        ];

        // 3. Minta Snap Token ke Midtrans
        $snapToken = Snap::getSnapToken($params);

        // 4. Kirim Token ke View
        return view('checkout', compact('snapToken'));
    }
}
