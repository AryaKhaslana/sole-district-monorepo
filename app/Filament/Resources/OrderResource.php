<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;

class OrderResource extends Resource
{
    protected static ?string $navigationGroup = 'Shop Management';

    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Kita tampilin ID tapi gak bisa diedit (Disabled)
            TextInput::make('id')->disabled(),
            
            // Ganti Status
            Select::make('status')
                ->options([
                    'pending' => 'Pending',
                    'waiting_verification' => 'Waiting Verification',
                    'paid' => 'Paid (Lunas)',
                    'failed' => 'Failed',
                ])
                ->required(),

            // Liat Bukti Transfer (Kalo mau ganti juga bisa)
            FileUpload::make('payment_proof')
                ->directory('payment_proofs')
                ->image()
                ->imageEditor(),
    
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'waiting_verification')->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return static::getModel()::where('status', 'waiting_verification')->count() > 0 ? 'warning' : 'success';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['id', 'user.name', 'total_price'];
    }
}
