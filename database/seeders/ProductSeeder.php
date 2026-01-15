<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
    \App\Models\Product::create([
        'name' => 'Laptop Gaming ROG',
        'description' => 'Laptop spek dewa buat ngoding Laravel',
        'price' => 25000000,
        'stock' => 10,
        'image_url' => 'laptop.jpg'
    ]);

    \App\Models\Product::create([
        'name' => 'Mouse Wireless',
        'description' => 'Mouse anti delay',
        'price' => 150000,
        'stock' => 50,
        'image_url' => 'mouse.jpg'
    ]);
    }
}
