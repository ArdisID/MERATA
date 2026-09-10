<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Order matters: Sekolah → Users → Guru → Kelas & Jadwal → Siswa → Fasilitas → Materi → Kebutuhan → Bantuan
     */
    public function run(): void
    {
        $this->call([
            SekolahSeeder::class,
            UserSeeder::class,
            GuruSeeder::class,
            KelasJadwalSeeder::class,
            SiswaSeeder::class,
            FasilitasSeeder::class,
            MateriSeeder::class,
            KebutuhanSeeder::class,
            PengirimanBantuanSeeder::class,
        ]);
    }
}
