<?php

namespace Database\Seeders;

use App\Models\Sekolah;
use Illuminate\Database\Seeder;

class SekolahSeeder extends Seeder
{
    public function run(): void
    {
        // From mockAdminData.js → initialSchoolProfile
        Sekolah::create([
            'nama' => 'SMP Negeri 1 Merata',
            'npsn' => '20108942',
            'akreditasi' => 'A (Unggul - Nilai 96)',
            'status_sekolah' => 'Negeri',
            'jenjang' => 'Sekolah Menengah Pertama (SMP)',
            'kepala_sekolah' => 'Dra. Hj. Sri Wahyuni, M.Pd.',
            'nip_kepsek' => '197405121998032001',
            'operator' => 'Ahmad Fauzi, S.Pd.',
            'alamat' => 'Jl. Merata Raya No. 45, Kecamatan Kebayoran Baru, Jakarta Selatan',
            'wilayah' => 'Jakarta Selatan, DKI Jakarta',
            'kode_pos' => '12180',
            'telepon' => '(021) 789-0123',
            'email' => 'info@smpn1merata.sch.id',
            'website' => 'https://smpn1merata.sch.id',
            'kurikulum' => 'Kurikulum Merdeka Mandiri Berbagi',
            'total_siswa' => 1248,
            'trend_siswa' => '+1% dari bulan lalu',
            'total_guru' => 84,
            'trend_guru' => '+2 baru semester ini',
            'total_kelas' => 142,
            'trend_kelas' => 'Stabil',
            'tingkat_kehadiran' => '94.2%',
            'trend_kehadiran' => '-0.5% minggu ini',
            'lab_komputer' => 1,
            'lab_ipa' => 1,
        ]);

        // From mockPemerintahData.js → mockSchoolListPemerintah
        Sekolah::create([
            'nama' => 'SMP Negeri 45 Pulau Seribu',
            'npsn' => '20109881',
            'akreditasi' => 'B',
            'status_sekolah' => 'Negeri',
            'jenjang' => 'Sekolah Menengah Pertama (SMP)',
            'wilayah' => 'Kepulauan Seribu',
            'total_siswa' => 340,
            'total_guru' => 24,
            'total_kelas' => 12,
            'tingkat_kehadiran' => '88.0%',
        ]);

        Sekolah::create([
            'nama' => 'SD Negeri Merata 03',
            'npsn' => '20105521',
            'akreditasi' => 'A',
            'status_sekolah' => 'Negeri',
            'jenjang' => 'Sekolah Dasar (SD)',
            'wilayah' => 'Jakarta Timur',
            'total_siswa' => 680,
            'total_guru' => 38,
            'total_kelas' => 18,
            'tingkat_kehadiran' => '95.0%',
        ]);
    }
}
