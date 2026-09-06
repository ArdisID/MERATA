<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Guru account
        User::create([
            'name' => 'Budi Santoso, S.Kom, S.Pd.',
            'email' => 'guru@merata.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        ]);

        // Admin Sekolah account
        User::create([
            'name' => 'Ahmad Fauzi, S.Pd.',
            'email' => 'admin@merata.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Pemerintah account
        User::create([
            'name' => 'Dr. H. Bambang Soeprapto, M.Ed.',
            'email' => 'pemerintah@merata.id',
            'password' => Hash::make('password'),
            'role' => 'pemerintah',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        ]);
    }
}
