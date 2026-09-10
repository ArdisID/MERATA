<?php

namespace Database\Seeders;

use App\Models\Sekolah;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $smp1 = Sekolah::where('npsn', '20108942')->first();
        $smk26 = Sekolah::where('npsn', '20102601')->first();
        $sd03 = Sekolah::where('npsn', '20105521')->first();
        $smp45 = Sekolah::where('npsn', '20109881')->first();
        $sma70 = Sekolah::where('npsn', '20107001')->first();

        // 1. Akun Pemerintah (Dinas Pendidikan)
        User::create([
            'name' => 'Dr. H. Bambang Soeprapto, M.Ed.',
            'email' => 'pemerintah@merata.id',
            'password' => Hash::make('password'),
            'role' => 'pemerintah',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        ]);

        // 2. Akun Admin Sekolah
        // Admin SMP Negeri 1 Merata
        User::create([
            'name' => 'Ahmad Fauzi, S.Pd.',
            'email' => 'admin@merata.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'sekolah_id' => $smp1?->id,
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        ]);

        // Admin SMK Negeri 26 Jakarta
        User::create([
            'name' => 'Bambang Irawan, S.Kom.',
            'email' => 'admin.smk26@merata.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'sekolah_id' => $smk26?->id,
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        ]);

        // Admin SD Negeri Merata 03
        User::create([
            'name' => 'Dian Anggraini, S.Pd.',
            'email' => 'admin.sd03@merata.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'sekolah_id' => $sd03?->id,
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
        ]);

        // Admin SMA Negeri 70 Jakarta
        User::create([
            'name' => 'Anita Wulandari, S.Pd.',
            'email' => 'admin.sma70@merata.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'sekolah_id' => $sma70?->id,
            'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
        ]);

        // Admin SMP Negeri 45 Pulau Seribu
        User::create([
            'name' => 'Rahmat Hidayat, S.Pd.',
            'email' => 'admin.smp45@merata.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'sekolah_id' => $smp45?->id,
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        ]);

        // 3. Akun Guru
        // Guru SMP Negeri 1 Merata
        User::create([
            'name' => 'Budi Santoso, S.Kom, S.Pd.',
            'email' => 'guru@merata.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'sekolah_id' => $smp1?->id,
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        ]);

        // Guru SMK Negeri 26 Jakarta
        User::create([
            'name' => 'Rizky Saputra, S.Pd., M.Kom.',
            'email' => 'guru.smk26@merata.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'sekolah_id' => $smk26?->id,
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
        ]);

        // Guru SD Negeri Merata 03
        User::create([
            'name' => 'Satria Wijaya, S.Pd.',
            'email' => 'guru.sd03@merata.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'sekolah_id' => $sd03?->id,
            'avatar' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
        ]);

        // Guru SMA Negeri 70 Jakarta
        User::create([
            'name' => 'Annisa Kusumawardhani, S.Pd., M.Pd.',
            'email' => 'guru.sma70@merata.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'sekolah_id' => $sma70?->id,
            'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        ]);

        // Guru SMP Negeri 45 Pulau Seribu
        User::create([
            'name' => 'Indah Saputra, S.Pd., M.Pd.',
            'email' => 'guru.smp45@merata.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'sekolah_id' => $smp45?->id,
            'avatar' => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=150',
        ]);
    }
}
