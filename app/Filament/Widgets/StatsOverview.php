<?php

namespace App\Filament\Widgets;

use App\Models\Order; // <--- Panggil Model Order
use App\Models\User;  // <--- Panggil Model User
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            // KARTU 1: TOTAL OMZET
            Stat::make('Total Omzet', 'Rp ' . number_format(Order::where('status', 'paid')->sum('total_price'), 0, ',', '.'))
                ->description('Duit masuk ke rekening')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success') // Warna Ijo
                ->chart([7, 2, 10, 3, 15, 4, 17]), // Grafik hiasan doang

            // KARTU 2: ORDER PENDING
            Stat::make('Perlu Verifikasi', Order::where('status', 'waiting_verification')->count())
                ->description('Buruan cek admin!')
                ->descriptionIcon('heroicon-m-bell')
                ->color('warning'), // Warna Kuning/Oranye

            // KARTU 3: TOTAL USER
            Stat::make('Total Pelanggan', User::count())
                ->description('Orang yang udah daftar')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'), // Warna Biru
        ];
    }
}