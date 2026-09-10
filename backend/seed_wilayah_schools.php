<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Sekolah;
use App\Models\Kebutuhan;
use Illuminate\Support\Facades\DB;

echo "=== SEEDING COMPREHENSIVE WILAYAH SCHOOLS ===" . PHP_EOL;

// 1. Clean existing ID 1's wilayah
$s1 = Sekolah::find(1);
if ($s1) {
    $s1->update(['wilayah' => 'Jakarta Selatan']);
    echo "Updated SMP Negeri 1 Merata wilayah to 'Jakarta Selatan'" . PHP_EOL;
}

$schoolsToEnsure = [
    // Jakarta Selatan
    [
        'nama' => 'SMP Negeri 19 Jakarta',
        'npsn' => '20101901',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Selatan',
        'alamat' => 'Jl. Bumi No. 21, Blok M, Jakarta Selatan',
        'total_siswa' => 980,
        'total_guru' => 58,
        'total_kelas' => 27,
        'tingkat_kehadiran' => '96.2%',
        'lab_komputer' => 2,
        'lab_ipa' => 1,
    ],
    [
        'nama' => 'SMA Negeri 70 Jakarta',
        'npsn' => '20107001',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Atas (SMA)',
        'wilayah' => 'Jakarta Selatan',
        'alamat' => 'Jl. Bulungan No. 1, Kebayoran Baru, Jakarta Selatan',
        'total_siswa' => 1120,
        'total_guru' => 76,
        'total_kelas' => 36,
        'tingkat_kehadiran' => '97.0%',
        'lab_komputer' => 3,
        'lab_ipa' => 2,
    ],
    [
        'nama' => 'SD Negeri Kebayoran Lama 01',
        'npsn' => '20100101',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Dasar (SD)',
        'wilayah' => 'Jakarta Selatan',
        'alamat' => 'Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan',
        'total_siswa' => 560,
        'total_guru' => 32,
        'total_kelas' => 18,
        'tingkat_kehadiran' => '95.5%',
        'lab_komputer' => 1,
        'lab_ipa' => 0,
    ],

    // Jakarta Timur
    [
        'nama' => 'SMP Negeri 49 Jakarta',
        'npsn' => '20104901',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Timur',
        'alamat' => 'Jl. Raya Bogor Km. 20, Kramat Jati, Jakarta Timur',
        'total_siswa' => 1040,
        'total_guru' => 62,
        'total_kelas' => 30,
        'tingkat_kehadiran' => '96.0%',
        'lab_komputer' => 2,
        'lab_ipa' => 1,
    ],
    [
        'nama' => 'SMA Negeri 61 Jakarta',
        'npsn' => '20106101',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Atas (SMA)',
        'wilayah' => 'Jakarta Timur',
        'alamat' => 'Jl. Pahlawan Revolusi No. 8, Duren Sawit, Jakarta Timur',
        'total_siswa' => 1080,
        'total_guru' => 68,
        'total_kelas' => 32,
        'tingkat_kehadiran' => '96.8%',
        'lab_komputer' => 2,
        'lab_ipa' => 2,
    ],
    [
        'nama' => 'SMK Negeri 26 Jakarta',
        'npsn' => '20102601',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Kejuruan (SMK)',
        'wilayah' => 'Jakarta Timur',
        'alamat' => 'Jl. Balai Pustaka Baru I, Rawamangun, Jakarta Timur',
        'total_siswa' => 1350,
        'total_guru' => 85,
        'total_kelas' => 36,
        'tingkat_kehadiran' => '95.2%',
        'lab_komputer' => 4,
        'lab_ipa' => 2,
    ],

    // Jakarta Barat
    [
        'nama' => 'SMP Negeri 111 Jakarta',
        'npsn' => '20111101',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Barat',
        'alamat' => 'Jl. Bhakti VII No. 2, Kemanggisan, Palmerah, Jakarta Barat',
        'total_siswa' => 1020,
        'total_guru' => 60,
        'total_kelas' => 30,
        'tingkat_kehadiran' => '95.8%',
        'lab_komputer' => 2,
        'lab_ipa' => 1,
    ],
    [
        'nama' => 'SMA Negeri 78 Jakarta',
        'npsn' => '20107801',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Atas (SMA)',
        'wilayah' => 'Jakarta Barat',
        'alamat' => 'Jl. Bhakti IV No. 1, Komplek Pajak, Kemanggisan, Jakarta Barat',
        'total_siswa' => 1100,
        'total_guru' => 72,
        'total_kelas' => 33,
        'tingkat_kehadiran' => '97.2%',
        'lab_komputer' => 3,
        'lab_ipa' => 2,
    ],
    [
        'nama' => 'SD Negeri Palmerah 05',
        'npsn' => '20100501',
        'akreditasi' => 'B',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Dasar (SD)',
        'wilayah' => 'Jakarta Barat',
        'alamat' => 'Jl. Palmerah Barat No. 34, Jakarta Barat',
        'total_siswa' => 520,
        'total_guru' => 28,
        'total_kelas' => 18,
        'tingkat_kehadiran' => '93.4%',
        'lab_komputer' => 0, // No lab! Priority!
        'lab_ipa' => 0,
    ],
    [
        'nama' => 'SMP Negeri 45 Jakarta',
        'npsn' => '20104501',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Barat',
        'alamat' => 'Jl. Utama Raya No. 45, Cengkareng Barat, Jakarta Barat',
        'total_siswa' => 890,
        'total_guru' => 52,
        'total_kelas' => 26,
        'tingkat_kehadiran' => '94.0%',
        'lab_komputer' => 1,
        'lab_ipa' => 1,
    ],

    // Jakarta Pusat
    [
        'nama' => 'SMP Negeri 1 Jakarta',
        'npsn' => '20100102',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Pusat',
        'alamat' => 'Jl. Cikini Raya No. 8, Menteng, Jakarta Pusat',
        'total_siswa' => 860,
        'total_guru' => 64,
        'total_kelas' => 24,
        'tingkat_kehadiran' => '97.5%',
        'lab_komputer' => 2,
        'lab_ipa' => 2,
    ],
    [
        'nama' => 'SMA Negeri 68 Jakarta',
        'npsn' => '20106801',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Atas (SMA)',
        'wilayah' => 'Jakarta Pusat',
        'alamat' => 'Jl. Salemba Raya No. 18, Senen, Jakarta Pusat',
        'total_siswa' => 940,
        'total_guru' => 68,
        'total_kelas' => 27,
        'tingkat_kehadiran' => '97.0%',
        'lab_komputer' => 3,
        'lab_ipa' => 2,
    ],
    [
        'nama' => 'SD Negeri Menteng 01',
        'npsn' => '20100103',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Dasar (SD)',
        'wilayah' => 'Jakarta Pusat',
        'alamat' => 'Jl. Besuki No. 4, Menteng, Jakarta Pusat',
        'total_siswa' => 480,
        'total_guru' => 35,
        'total_kelas' => 16,
        'tingkat_kehadiran' => '98.0%',
        'lab_komputer' => 1,
        'lab_ipa' => 1,
    ],

    // Jakarta Utara
    [
        'nama' => 'SMP Negeri 30 Jakarta',
        'npsn' => '20103001',
        'akreditasi' => 'A',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Utara',
        'alamat' => 'Jl. Anggrek No. 4, Koja, Jakarta Utara',
        'total_siswa' => 910,
        'total_guru' => 50,
        'total_kelas' => 26,
        'tingkat_kehadiran' => '94.5%',
        'lab_komputer' => 1,
        'lab_ipa' => 1,
    ],
    [
        'nama' => 'SD Negeri Marunda 02',
        'npsn' => '20100201',
        'akreditasi' => 'B',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Dasar (SD)',
        'wilayah' => 'Jakarta Utara',
        'alamat' => 'Jl. Marunda Baru No. 10, Cilincing, Jakarta Utara',
        'total_siswa' => 580,
        'total_guru' => 26,
        'total_kelas' => 18,
        'tingkat_kehadiran' => '91.0%',
        'lab_komputer' => 0, // No lab! Priority!
        'lab_ipa' => 0,
    ],
    [
        'nama' => 'SMP Negeri 173 Jakarta',
        'npsn' => '20117301',
        'akreditasi' => 'B',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Pertama (SMP)',
        'wilayah' => 'Jakarta Utara',
        'alamat' => 'Jl. Alur Laut No. 1, Rawabadak Selatan, Koja, Jakarta Utara',
        'total_siswa' => 840,
        'total_guru' => 44,
        'total_kelas' => 24,
        'tingkat_kehadiran' => '92.5%',
        'lab_komputer' => 0, // No lab! Priority!
        'lab_ipa' => 1,
    ],
    [
        'nama' => 'SD Negeri Kalibaru 01',
        'npsn' => '20100104',
        'akreditasi' => 'B',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Dasar (SD)',
        'wilayah' => 'Jakarta Utara',
        'alamat' => 'Jl. Kalibaru Barat No. 15, Cilincing, Jakarta Utara',
        'total_siswa' => 640,
        'total_guru' => 29,
        'total_kelas' => 18,
        'tingkat_kehadiran' => '90.5%',
        'lab_komputer' => 0, // No lab! Priority!
        'lab_ipa' => 0,
    ],

    // Kepulauan Seribu
    [
        'nama' => 'SD Negeri Pulau Panggang 01',
        'npsn' => '20100105',
        'akreditasi' => 'B',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Dasar (SD)',
        'wilayah' => 'Kepulauan Seribu',
        'alamat' => 'Pulau Panggang RT 02/03, Kepulauan Seribu Utara',
        'total_siswa' => 210,
        'total_guru' => 16,
        'total_kelas' => 6,
        'tingkat_kehadiran' => '87.5%',
        'lab_komputer' => 0,
        'lab_ipa' => 0,
    ],
    [
        'nama' => 'SMA Negeri 1 Kepulauan Seribu',
        'npsn' => '20100106',
        'akreditasi' => 'B',
        'status_sekolah' => 'Negeri',
        'jenjang' => 'Sekolah Menengah Atas (SMA)',
        'wilayah' => 'Kepulauan Seribu',
        'alamat' => 'Pulau Pramuka RT 04/05, Kepulauan Seribu',
        'total_siswa' => 280,
        'total_guru' => 20,
        'total_kelas' => 9,
        'tingkat_kehadiran' => '89.0%',
        'lab_komputer' => 1,
        'lab_ipa' => 1,
    ],
];

foreach ($schoolsToEnsure as $sch) {
    $existing = Sekolah::where('npsn', $sch['npsn'])->first();
    if (!$existing) {
        $created = Sekolah::create($sch);
        echo "Created: {$created->nama} ({$created->wilayah})" . PHP_EOL;
    } else {
        $existing->update($sch);
        echo "Updated: {$existing->nama} ({$existing->wilayah})" . PHP_EOL;
    }
}

// 2. Add realistic kebutuhan for Jakarta Utara & Kepulauan Seribu & Jakarta Barat
$extraKebutuhan = [
    [
        'npsn' => '20100201', // SD Negeri Marunda 02
        'kode' => 'VRF-011',
        'judul' => 'Pengadaan 20 Unit Komputer & Server ANBK',
        'kategori' => 'Lab Komputer & Perangkat TIK',
        'pemohon' => 'Siti Rahmawati, S.Pd.',
        'peran_pemohon' => 'Guru & Operator Sekolah',
        'tanggal' => '08 Sep 2026',
        'urgensi' => 'Mendesak',
        'estimasi_biaya' => 'Rp 140.000.000',
        'justifikasi' => 'Siswa menumpang ANBK ke sekolah lain sejauh 7 km. Butuh lab mandiri.',
        'status' => 'menunggu',
        'status_label' => 'Menunggu Verifikasi Dinas',
    ],
    [
        'npsn' => '20117301', // SMP Negeri 173 Jakarta
        'kode' => 'VRF-012',
        'judul' => 'Renovasi Plafon & Atap Bocor 4 Ruang Kelas',
        'kategori' => 'Renovasi Atap & Ruang Kelas',
        'pemohon' => 'Drs. Hendro Wibowo',
        'peran_pemohon' => 'Wakil Sarpras',
        'tanggal' => '07 Sep 2026',
        'urgensi' => 'Mendesak',
        'estimasi_biaya' => 'Rp 85.000.000',
        'justifikasi' => 'Saat hujan lebat air merembes ke ruang kelas lantai 2 membahayakan siswa.',
        'status' => 'menunggu',
        'status_label' => 'Menunggu Verifikasi Dinas',
    ],
    [
        'npsn' => '20100104', // SD Negeri Kalibaru 01
        'kode' => 'VRF-013',
        'judul' => 'Pembangunan 4 Pintu Toilet Siswa & Sanitasi Sehat',
        'kategori' => 'Sanitasi & Toilet Siswa Sehat',
        'pemohon' => 'Nur Azizah, S.Pd.SD',
        'peran_pemohon' => 'Guru Kelas',
        'tanggal' => '06 Sep 2026',
        'urgensi' => 'Mendesak',
        'estimasi_biaya' => 'Rp 45.000.000',
        'justifikasi' => 'Toilet yang ada rusak dan air payau, tidak memenuhi rasio standar kesehatan sekolah.',
        'status' => 'menunggu',
        'status_label' => 'Menunggu Verifikasi Dinas',
    ],
    [
        'npsn' => '20100105', // SD Negeri Pulau Panggang 01
        'kode' => 'VRF-014',
        'judul' => 'Instalasi Listrik Panel Surya 5000 Watt & Baterai',
        'kategori' => 'Pemeliharaan Sarpras',
        'pemohon' => 'Hasan Basri, S.Pd.',
        'peran_pemohon' => 'Kepala Sekolah',
        'tanggal' => '05 Sep 2026',
        'urgensi' => 'Mendesak',
        'estimasi_biaya' => 'Rp 95.000.000',
        'justifikasi' => 'Listrik pulau sering padam siang hari sehingga pembelajaran digital dan printer terhenti.',
        'status' => 'menunggu',
        'status_label' => 'Menunggu Verifikasi Dinas',
    ],
    [
        'npsn' => '20100501', // SD Negeri Palmerah 05
        'kode' => 'VRF-015',
        'judul' => 'Pengadaan Buku Pelajaran Kurikulum Merdeka Fase A-C',
        'kategori' => 'Ruang Perpustakaan & Buku Teks',
        'pemohon' => 'Rini Susanti, S.Pd.',
        'peran_pemohon' => 'Kepala Perpustakaan',
        'tanggal' => '09 Sep 2026',
        'urgensi' => 'Sedang',
        'estimasi_biaya' => 'Rp 32.000.000',
        'justifikasi' => 'Kekurangan buku paket untuk 520 siswa yang masih menggunakan fotokopi.',
        'status' => 'disetujui_sekolah',
        'status_label' => 'Disetujui Sekolah',
    ],
];

foreach ($extraKebutuhan as $k) {
    $sch = Sekolah::where('npsn', $k['npsn'])->first();
    if (!$sch) continue;

    $existing = Kebutuhan::where('kode', $k['kode'])->first();
    if (!$existing) {
        Kebutuhan::create([
            'sekolah_id' => $sch->id,
            'guru_id' => 1,
            'kode' => $k['kode'],
            'judul' => $k['judul'],
            'kategori' => $k['kategori'],
            'pemohon' => $k['pemohon'],
            'peran_pemohon' => $k['peran_pemohon'],
            'tanggal' => $k['tanggal'],
            'urgensi' => $k['urgensi'],
            'estimasi_biaya' => $k['estimasi_biaya'],
            'justifikasi' => $k['justifikasi'],
            'status' => $k['status'],
            'status_label' => $k['status_label'],
            'tipe' => 'verifikasi',
        ]);
        echo "Created Kebutuhan: {$k['kode']} for {$sch->nama}" . PHP_EOL;
    }
}

echo "DONE! Total schools in DB: " . Sekolah::count() . PHP_EOL;
