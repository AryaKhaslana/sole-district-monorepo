<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\User::create([
        'name' => 'Sultan Broskie',
        'email' => 'admin@gmail.com',
        'password' => bcrypt('12345678'), // Passwordnya ini
        'role' => 'admin', // <--- JANGAN LUPA HURUF GEDE!
        ]);
    }
}
