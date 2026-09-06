<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Sekolah;
use App\Models\User;
use Illuminate\Database\Seeder;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        $sekolah = Sekolah::where('npsn', '20108942')->first();
        $guruUser = User::where('email', 'guru@merata.id')->first();

        // From mockAdminData.js → initialTeachers (5 guru)
        // GUR-001 linked to the guru user account
        Guru::create([
            'user_id' => $guruUser?->id,
            'sekolah_id' => $sekolah?->id,
            'kode' => 'GUR-001',
            'nip' => '198203152006041003',
            'nama' => 'Budi Santoso, S.Kom',
            'gender' => 'Laki-laki',
            'mapel' => 'Informatika & TIK',
            'kelas_ajar' => ['7A', '8A', '9A', '9B'],
            'jabatan' => 'Kepala Lab Komputer & Guru TIK',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2015)',
            'pendidikan' => 'S1 Pendidikan Ilmu Komputer',
            'lama_mengajar' => '18 Tahun',
            'poin_kontribusi' => 450,
            'kebutuhan' => 'Peremajaan 15 unit PC Lab, Lisensi OS/Software Edukasi, Akses Internet 100 Mbps',
            'telepon' => '0812-3456-7890',
            'email' => 'budi.santoso@guru.merata.id',
        ]);

        Guru::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'GUR-002',
            'nip' => '198807212011012009',
            'nama' => 'Dewi Lestari, M.Pd.',
            'gender' => 'Perempuan',
            'mapel' => 'Matematika',
            'kelas_ajar' => ['8A', '8B', '8C'],
            'jabatan' => 'Wali Kelas 8B & Tim Kurikulum',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2019)',
            'pendidikan' => 'S2 Pendidikan Matematika',
            'lama_mengajar' => '12 Tahun',
            'poin_kontribusi' => 380,
            'kebutuhan' => 'Alat Peraga Geometri 3D, Proyektor Interaktif Kelas',
            'telepon' => '0813-9876-5432',
            'email' => 'dewi.lestari@guru.merata.id',
        ]);

        Guru::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'GUR-003',
            'nip' => '197604122002121002',
            'nama' => 'Drs. Bambang Sudarmono',
            'gender' => 'Laki-laki',
            'mapel' => 'IPA Terpadu (Fisika)',
            'kelas_ajar' => ['9A', '9B', '9C'],
            'jabatan' => 'Kepala Laboratorium IPA',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2010)',
            'pendidikan' => 'S1 Pendidikan Fisika',
            'lama_mengajar' => '24 Tahun',
            'poin_kontribusi' => 520,
            'kebutuhan' => 'Kit Percobaan Optik, Neraca Ohaus Digital, Mikroskop Binokuler Tambahan',
            'telepon' => '0811-2233-4455',
            'email' => 'bambang.sudarmono@guru.merata.id',
        ]);

        Guru::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'GUR-004',
            'nip' => '199305102022212015',
            'nama' => 'Ratna Sari, S.Pd.',
            'gender' => 'Perempuan',
            'mapel' => 'Bahasa Indonesia',
            'kelas_ajar' => ['7A', '7B', '7C'],
            'jabatan' => 'Wali Kelas 7C & Pembina Jurnalistik',
            'status_kepegawaian' => 'PPPK',
            'sertifikasi' => 'Dalam Proses PPG',
            'pendidikan' => 'S1 Sastra & Pendidikan Bhs Indonesia',
            'lama_mengajar' => '5 Tahun',
            'poin_kontribusi' => 210,
            'kebutuhan' => 'Buku Pengayaan Pojok Baca Kelas, Akses Platform E-Perpus Nasional',
            'telepon' => '0857-1122-3344',
            'email' => 'ratna.sari@guru.merata.id',
        ]);

        Guru::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'GUR-005',
            'nip' => '-',
            'nama' => 'Farhan Maulana, S.Pd.',
            'gender' => 'Laki-laki',
            'mapel' => 'Pendidikan Jasmani & Kesehatan (PJOK)',
            'kelas_ajar' => ['7A', '8A', '9A'],
            'jabatan' => 'Wali Kelas 7A & Koordinator Olahraga',
            'status_kepegawaian' => 'Honorer',
            'sertifikasi' => 'Belum Sertifikasi',
            'pendidikan' => 'S1 Kepelatihan Olahraga',
            'lama_mengajar' => '3 Tahun',
            'poin_kontribusi' => 160,
            'kebutuhan' => 'Matras Senam Baru, Bola Basket Molten, Pelatihan P3K Keolahragaan',
            'telepon' => '0878-9988-7766',
            'email' => 'farhan.maulana@guru.merata.id',
        ]);
    }
}
