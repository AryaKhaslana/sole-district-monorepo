<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrdersRelationManager extends RelationManager
{
    protected static string $relationship = 'orders';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
        ->recordTitleAttribute('id') // Ganti jadi ID order
        ->columns([
            // Kita gak butuh nama user lagi (kan udah di halaman user)
            Tables\Columns\TextColumn::make('id')
                ->label('Order ID')
                ->sortable(),
                
            Tables\Columns\TextColumn::make('total_price')
                ->money('IDR'),
                
            Tables\Columns\TextColumn::make('status')
                ->badge()
                ->color(fn (string $state): string => match ($state) {
                    'pending' => 'gray',
                    'waiting_verification' => 'warning',
                    'paid' => 'success',
                    'failed' => 'danger',
                }),
                
            Tables\Columns\TextColumn::make('created_at')
                ->label('Tanggal Beli')
                ->date(),
        ]);
    }
}
