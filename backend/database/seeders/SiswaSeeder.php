<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Sekolah;
use App\Models\Siswa;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        $smp1  = Sekolah::where('npsn', '20108942')->first();
        $smk26 = Sekolah::where('npsn', '20102601')->first();
        $sd03  = Sekolah::where('npsn', '20105521')->first();
        $sma70 = Sekolah::where('npsn', '20107001')->first();
        $smp45 = Sekolah::where('npsn', '20109881')->first();

        $badgeFor = fn($status) => match ($status) {
            'Penerima KIP'      => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Beasiswa Prestasi' => 'bg-blue-50 text-blue-700 border-blue-200',
            default             => 'bg-slate-50 text-slate-600 border-slate-200',
        };

        // ==============================================================
        // 1. SMP NEGERI 1 MERATA — Kelas 7A, 7B, 8A, 8B, 9A, 9B
        // ==============================================================
        if ($smp1) {
            $kls7a = Kelas::where('sekolah_id', $smp1->id)->where('nama', '7A')->first();
            $kls7b = Kelas::where('sekolah_id', $smp1->id)->where('nama', '7B')->first();
            $kls8a = Kelas::where('sekolah_id', $smp1->id)->where('nama', '8A')->first();
            $kls8b = Kelas::where('sekolah_id', $smp1->id)->where('nama', '8B')->first();
            $kls9a = Kelas::where('sekolah_id', $smp1->id)->where('nama', '9A')->first();
            $kls9b = Kelas::where('sekolah_id', $smp1->id)->where('nama', '9B')->first();

            $students = [
                // Kelas 7A
                ['nisn' => '0089123411', 'nama' => 'Aditya Pratama Putra',    'gender' => 'Laki-laki',  'kelas_id' => $kls7a?->id, 'kelas_nama' => '7A', 'kehadiran' => 98, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 94.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Buku Olimpiade Sains',                      'catatan' => 'Juara 1 OSN Matematika tingkat kota.'],
                ['nisn' => '0089123412', 'nama' => 'Rizky Aulia Ramadhan',    'gender' => 'Laki-laki',  'kelas_id' => $kls7a?->id, 'kelas_nama' => '7A', 'kehadiran' => 95, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 86.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Seragam & Sepatu Sekolah',                  'catatan' => 'Aktif ekstrakurikuler robotik.'],
                ['nisn' => '0089123413', 'nama' => 'Nadia Putri Rahayu',      'gender' => 'Perempuan',  'kelas_id' => $kls7a?->id, 'kelas_nama' => '7A', 'kehadiran' => 100,'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 97.2, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Buku Referensi Lanjutan',                   'catatan' => 'Peringkat 1 paralel kelas 7.'],
                ['nisn' => '0089123414', 'nama' => 'Farhan Alamsyah',         'gender' => 'Laki-laki',  'kelas_id' => $kls7a?->id, 'kelas_nama' => '7A', 'kehadiran' => 74, 'status_kehadiran' => 'Perhatian Khusus',   'nilai_rata_rata' => 68.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Bantuan Transport & Konseling',             'catatan' => 'Terkendala jarak rumah yang jauh.'],
                // Kelas 7B
                ['nisn' => '0089123415', 'nama' => 'Siti Nurhaliza',          'gender' => 'Perempuan',  'kelas_id' => $kls7b?->id, 'kelas_nama' => '7B', 'kehadiran' => 96, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 88.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Kamus Bahasa Inggris',                      'catatan' => 'Aktif di klub debat bahasa Inggris.'],
                ['nisn' => '0089123416', 'nama' => 'Fajri Maulana Akbar',     'gender' => 'Laki-laki',  'kelas_id' => $kls7b?->id, 'kelas_nama' => '7B', 'kehadiran' => 89, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 80.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Buku Paket Kurikulum Merdeka',              'catatan' => 'Minat di bidang seni musik.'],
                // Kelas 8A
                ['nisn' => '0089123420', 'nama' => 'Zahra Amelia Santoso',    'gender' => 'Perempuan',  'kelas_id' => $kls8a?->id, 'kelas_nama' => '8A', 'kehadiran' => 96, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 91.5, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Alat Musik Biola Praktik',                  'catatan' => 'Anggota tim orkestra sekolah.'],
                ['nisn' => '0089123421', 'nama' => 'Dimas Arya Permana',      'gender' => 'Laki-laki',  'kelas_id' => $kls8a?->id, 'kelas_nama' => '8A', 'kehadiran' => 92, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 85.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Buku Paket Kurikulum Merdeka',              'catatan' => 'Minat tinggi di bidang coding.'],
                ['nisn' => '0089123422', 'nama' => 'Intan Permatasari',       'gender' => 'Perempuan',  'kelas_id' => $kls8a?->id, 'kelas_nama' => '8A', 'kehadiran' => 93, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 87.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Seragam OSIS',                              'catatan' => 'Ketua OSIS aktif.'],
                // Kelas 8B
                ['nisn' => '0089123423', 'nama' => 'Rendi Satria',            'gender' => 'Laki-laki',  'kelas_id' => $kls8b?->id, 'kelas_nama' => '8B', 'kehadiran' => 88, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 79.5, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Laptop untuk tugas',                        'catatan' => 'Aktif di ekskul futsal.'],
                ['nisn' => '0089123424', 'nama' => 'Dewi Ratnasari',          'gender' => 'Perempuan',  'kelas_id' => $kls8b?->id, 'kelas_nama' => '8B', 'kehadiran' => 97, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 90.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Kacamata baca',                             'catatan' => 'Juara olimpiade IPA tingkat kota.'],
                // Kelas 9A
                ['nisn' => '0089123430', 'nama' => 'Mahendra Wijaya',         'gender' => 'Laki-laki',  'kelas_id' => $kls9a?->id, 'kelas_nama' => '9A', 'kehadiran' => 99, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 93.5, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Buku Persiapan UN',                         'catatan' => 'Target masuk SMAN 1 Jakarta.'],
                ['nisn' => '0089123431', 'nama' => 'Tiara Putri Anastasia',   'gender' => 'Perempuan',  'kelas_id' => $kls9a?->id, 'kelas_nama' => '9A', 'kehadiran' => 95, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 89.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Buku Latihan Soal UN & Try Out',            'catatan' => 'Aktif bimbel mandiri.'],
                // Kelas 9B
                ['nisn' => '0089123432', 'nama' => 'Arief Budiman',           'gender' => 'Laki-laki',  'kelas_id' => $kls9b?->id, 'kelas_nama' => '9B', 'kehadiran' => 84, 'status_kehadiran' => 'Perhatian Khusus',   'nilai_rata_rata' => 72.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Pendampingan belajar & alat tulis',         'catatan' => 'Perlu perhatian ekstra untuk UN.'],
                ['nisn' => '0089123433', 'nama' => 'Layla Syafira Hasanah',   'gender' => 'Perempuan',  'kelas_id' => $kls9b?->id, 'kelas_nama' => '9B', 'kehadiran' => 98, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 95.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Persiapan Lomba Peneliti Remaja',           'catatan' => 'Finalis LKIR tingkat Provinsi.'],
            ];

            foreach ($students as $idx => $st) {
                Siswa::create(array_merge($st, [
                    'sekolah_id'   => $smp1->id,
                    'kode'         => 'SIS-SMP1-' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT),
                    'bantuan_badge' => $badgeFor($st['status_bantuan']),
                ]));
            }
        }

        // ==============================================================
        // 2. SMK NEGERI 26 JAKARTA — Kelas X TKJ 1, X RPL 1, XI TKJ 1,
        //    XI RPL 1, XII TKJ 1, XII RPL 1
        // ==============================================================
        if ($smk26) {
            $klsXtkj1  = Kelas::where('sekolah_id', $smk26->id)->where('nama', 'X TKJ 1')->first();
            $klsXrpl1  = Kelas::where('sekolah_id', $smk26->id)->where('nama', 'X RPL 1')->first();
            $klsXItkj1 = Kelas::where('sekolah_id', $smk26->id)->where('nama', 'XI TKJ 1')->first();
            $klsXIrpl1 = Kelas::where('sekolah_id', $smk26->id)->where('nama', 'XI RPL 1')->first();
            $klsXIItkj = Kelas::where('sekolah_id', $smk26->id)->where('nama', 'XII TKJ 1')->first();
            $klsXIIrpl = Kelas::where('sekolah_id', $smk26->id)->where('nama', 'XII RPL 1')->first();

            $students = [
                // Kelas X TKJ 1
                ['nisn' => '0078260001', 'nama' => 'Ahmad Danial Fikri',      'gender' => 'Laki-laki',  'kelas_id' => $klsXtkj1?->id,  'kelas_nama' => 'X TKJ 1',   'kehadiran' => 97, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 92.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Toolkit Tang Crimping & Tester LAN',        'catatan' => 'Mahir konfigurasi Mikrotik Router.'],
                ['nisn' => '0078260002', 'nama' => 'Bayu Wicaksono',          'gender' => 'Laki-laki',  'kelas_id' => $klsXtkj1?->id,  'kelas_nama' => 'X TKJ 1',   'kehadiran' => 94, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 88.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Perangkat Laptop Praktik Jaringan',         'catatan' => 'Siswa aktif di UKS & OSIS.'],
                ['nisn' => '0078260007', 'nama' => 'Gilang Ramadan',          'gender' => 'Laki-laki',  'kelas_id' => $klsXtkj1?->id,  'kelas_nama' => 'X TKJ 1',   'kehadiran' => 90, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 83.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Buku Dasar Jaringan Komputer',              'catatan' => 'Tertarik jurusan networking & server.'],
                // Kelas X RPL 1
                ['nisn' => '0078260003', 'nama' => 'Clarissa Anindya Putri',  'gender' => 'Perempuan',  'kelas_id' => $klsXrpl1?->id,  'kelas_nama' => 'X RPL 1',   'kehadiran' => 99, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 96.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Langganan Hosting & Domain Portofolio',     'catatan' => 'Juara LKS Web Technologies Wilayah.'],
                ['nisn' => '0078260004', 'nama' => 'Dwi Cahyo Nugroho',       'gender' => 'Laki-laki',  'kelas_id' => $klsXrpl1?->id,  'kelas_nama' => 'X RPL 1',   'kehadiran' => 76, 'status_kehadiran' => 'Perhatian Khusus',   'nilai_rata_rata' => 71.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Subsidi Kuota & Laptop Rekondisi',          'catatan' => 'Kesulitan fasilitas laptop untuk praktikum.'],
                ['nisn' => '0078260008', 'nama' => 'Hana Salsabila',          'gender' => 'Perempuan',  'kelas_id' => $klsXrpl1?->id,  'kelas_nama' => 'X RPL 1',   'kehadiran' => 95, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 90.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Akses platform coding premium',             'catatan' => 'Sudah bisa membuat aplikasi React Native.'],
                // Kelas XI TKJ 1
                ['nisn' => '0078260009', 'nama' => 'Ilham Setiawan',          'gender' => 'Laki-laki',  'kelas_id' => $klsXItkj1?->id, 'kelas_nama' => 'XI TKJ 1',  'kehadiran' => 93, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 86.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Modul CCNA & perangkat Cisco Packet Tracer','catatan' => 'Bersiap mengikuti sertifikasi CCNA.'],
                ['nisn' => '0078260010', 'nama' => 'Jasmine Aulia Rahma',     'gender' => 'Perempuan',  'kelas_id' => $klsXItkj1?->id, 'kelas_nama' => 'XI TKJ 1',  'kehadiran' => 97, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 91.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Router MikroTik seri RB750',                'catatan' => 'Asisten praktikum lab jaringan.'],
                // Kelas XI RPL 1
                ['nisn' => '0078260005', 'nama' => 'Eka Pratiwi',             'gender' => 'Perempuan',  'kelas_id' => $klsXIrpl1?->id, 'kelas_nama' => 'XI RPL 1',  'kehadiran' => 95, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 89.5, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Voucher Ujian Sertifikasi Oracle Java',     'catatan' => 'Siap magang di software house.'],
                ['nisn' => '0078260006', 'nama' => 'Faisal Rahman',           'gender' => 'Laki-laki',  'kelas_id' => $klsXIrpl1?->id, 'kelas_nama' => 'XI RPL 1',  'kehadiran' => 98, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 93.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Akses Course Fullstack Developer',           'catatan' => 'Menyelesaikan 3 aplikasi Flutter.'],
                // Kelas XII TKJ 1
                ['nisn' => '0078260011', 'nama' => 'Kevin Dharmawan',         'gender' => 'Laki-laki',  'kelas_id' => $klsXIItkj?->id, 'kelas_nama' => 'XII TKJ 1', 'kehadiran' => 96, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 90.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Biaya Sertifikasi MTCNA Mikrotik',          'catatan' => 'PKL di PT Telkom Divisi Enterprise.'],
                ['nisn' => '0078260012', 'nama' => 'Luna Maharani',           'gender' => 'Perempuan',  'kelas_id' => $klsXIItkj?->id, 'kelas_nama' => 'XII TKJ 1', 'kehadiran' => 94, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 87.5, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Modul CCNP lanjutan',                       'catatan' => 'Diterima magang di Indosat Ooredoo.'],
                // Kelas XII RPL 1
                ['nisn' => '0078260013', 'nama' => 'Muhamad Rizal Saputra',   'gender' => 'Laki-laki',  'kelas_id' => $klsXIIrpl?->id, 'kelas_nama' => 'XII RPL 1', 'kehadiran' => 98, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 94.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Lisensi Adobe Creative Suite',               'catatan' => 'Portofolio 5+ proyek web live.'],
                ['nisn' => '0078260014', 'nama' => 'Nandita Kusuma',          'gender' => 'Perempuan',  'kelas_id' => $klsXIIrpl?->id, 'kelas_nama' => 'XII RPL 1', 'kehadiran' => 92, 'status_kehadiran' => 'Baik',               'nilai_rata_rata' => 88.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Laptop Upgrade RAM 16GB',                   'catatan' => 'Sedang mengerjakan tugas akhir aplikasi inventaris.'],
            ];

            foreach ($students as $idx => $st) {
                Siswa::create(array_merge($st, [
                    'sekolah_id'    => $smk26->id,
                    'kode'          => 'SIS-SMK26-' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT),
                    'bantuan_badge' => $badgeFor($st['status_bantuan']),
                ]));
            }
        }

        // ==============================================================
        // 3. SD NEGERI MERATA 03 — Kelas 1A, 2A, 3A, 4A, 5A, 6A
        // ==============================================================
        if ($sd03) {
            $kls1a = Kelas::where('sekolah_id', $sd03->id)->where('nama', '1A')->first();
            $kls2a = Kelas::where('sekolah_id', $sd03->id)->where('nama', '2A')->first();
            $kls3a = Kelas::where('sekolah_id', $sd03->id)->where('nama', '3A')->first();
            $kls4a = Kelas::where('sekolah_id', $sd03->id)->where('nama', '4A')->first();
            $kls5a = Kelas::where('sekolah_id', $sd03->id)->where('nama', '5A')->first();
            $kls6a = Kelas::where('sekolah_id', $sd03->id)->where('nama', '6A')->first();

            $students = [
                // Kelas 1A
                ['nisn' => '0145520001', 'nama' => 'Alifa Zahira Maulida',    'gender' => 'Perempuan', 'kelas_id' => $kls1a?->id, 'kelas_nama' => '1A', 'kehadiran' => 98, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 92.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Buku Mewarnai & Cerita Bergambar',  'catatan' => 'Sangat aktif dalam kegiatan membaca.'],
                ['nisn' => '0145520002', 'nama' => 'Bima Sakti Pratama',      'gender' => 'Laki-laki', 'kelas_id' => $kls1a?->id, 'kelas_nama' => '1A', 'kehadiran' => 94, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 88.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Seragam Merah Putih & Sepatu',      'catatan' => 'Mendapatkan bantuan gizi program MBG.'],
                // Kelas 2A
                ['nisn' => '0145520010', 'nama' => 'Citra Dewi Lestari',      'gender' => 'Perempuan', 'kelas_id' => $kls2a?->id, 'kelas_nama' => '2A', 'kehadiran' => 96, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 87.5, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Tas Sekolah & Alat Tulis',          'catatan' => 'Pandai bernyanyi dan menari.'],
                ['nisn' => '0145520011', 'nama' => 'Doni Saputra',            'gender' => 'Laki-laki', 'kelas_id' => $kls2a?->id, 'kelas_nama' => '2A', 'kehadiran' => 90, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 80.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Buku Cerita Bergambar',             'catatan' => 'Penerima program makan bergizi gratis.'],
                // Kelas 3A
                ['nisn' => '0145520020', 'nama' => 'Erisa Cantika',           'gender' => 'Perempuan', 'kelas_id' => $kls3a?->id, 'kelas_nama' => '3A', 'kehadiran' => 99, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 93.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Buku Latihan Matematika Kelas 3',   'catatan' => 'Juara olimpiade matematika tingkat kecamatan.'],
                ['nisn' => '0145520021', 'nama' => 'Fandi Ahmad Kurnia',      'gender' => 'Laki-laki', 'kelas_id' => $kls3a?->id, 'kelas_nama' => '3A', 'kehadiran' => 85, 'status_kehadiran' => 'Perhatian Khusus', 'nilai_rata_rata' => 74.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Kacamata & nutrisi tambahan',       'catatan' => 'Sering tidak fokus, perlu konsultasi dokter mata.'],
                // Kelas 4A
                ['nisn' => '0145520030', 'nama' => 'Gilang Pramudita',        'gender' => 'Laki-laki', 'kelas_id' => $kls4a?->id, 'kelas_nama' => '4A', 'kehadiran' => 97, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 89.5, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Alat olahraga (raket badminton)',   'catatan' => 'Juara badminton antar SD se-kecamatan.'],
                ['nisn' => '0145520031', 'nama' => 'Hana Aprilia Sari',       'gender' => 'Perempuan', 'kelas_id' => $kls4a?->id, 'kelas_nama' => '4A', 'kehadiran' => 92, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 85.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Buku Tematik kelas 4',              'catatan' => 'Siswa pindahan dari Bogor.'],
                // Kelas 5A
                ['nisn' => '0145520003', 'nama' => 'Cahaya Ramadhani',        'gender' => 'Perempuan', 'kelas_id' => $kls5a?->id, 'kelas_nama' => '5A', 'kehadiran' => 100,'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 95.5, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Buku Matematika Kelas 5',           'catatan' => 'Ketua kelompok literasi kelas.'],
                ['nisn' => '0145520004', 'nama' => 'Dafi Muhammad Faris',     'gender' => 'Laki-laki', 'kelas_id' => $kls5a?->id, 'kelas_nama' => '5A', 'kehadiran' => 78, 'status_kehadiran' => 'Perhatian Khusus', 'nilai_rata_rata' => 72.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Kacamata & nutrisi tambahan',       'catatan' => 'Sering mengeluh pusing saat membaca tulisan di papan.'],
                // Kelas 6A
                ['nisn' => '0145520040', 'nama' => 'Indra Permana Putra',     'gender' => 'Laki-laki', 'kelas_id' => $kls6a?->id, 'kelas_nama' => '6A', 'kehadiran' => 98, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 93.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Persiapan buku PPDB SMP',           'catatan' => 'Target masuk SMP Negeri favorit.'],
                ['nisn' => '0145520041', 'nama' => 'Jihan Adila Putri',       'gender' => 'Perempuan', 'kelas_id' => $kls6a?->id, 'kelas_nama' => '6A', 'kehadiran' => 95, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 90.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Biaya les persiapan PPDB',          'catatan' => 'Aktif di kegiatan Pramuka Penggalang.'],
            ];

            foreach ($students as $idx => $st) {
                Siswa::create(array_merge($st, [
                    'sekolah_id'    => $sd03->id,
                    'kode'          => 'SIS-SD03-' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT),
                    'bantuan_badge' => $badgeFor($st['status_bantuan']),
                ]));
            }
        }

        // ==============================================================
        // 4. SMA NEGERI 70 JAKARTA — Kelas X IPA 1, X IPS 1, XI MIPA 1,
        //    XII MIPA 1
        // ==============================================================
        if ($sma70) {
            $klsXipa1  = Kelas::where('sekolah_id', $sma70->id)->where('nama', 'X IPA 1')->first();
            $klsXips1  = Kelas::where('sekolah_id', $sma70->id)->where('nama', 'X IPS 1')->first();
            $klsXImipa = Kelas::where('sekolah_id', $sma70->id)->where('nama', 'XI MIPA 1')->first();
            $klsXIImip = Kelas::where('sekolah_id', $sma70->id)->where('nama', 'XII MIPA 1')->first();

            $students = [
                // Kelas X IPA 1
                ['nisn' => '0067000001', 'nama' => 'Amanda Kirana Larasati',  'gender' => 'Perempuan', 'kelas_id' => $klsXipa1?->id,  'kelas_nama' => 'X IPA 1',    'kehadiran' => 99, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 96.5, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Kit Praktikum Biologi Molekuler',   'catatan' => 'Finalis OSN Biologi Nasional.'],
                ['nisn' => '0067000005', 'nama' => 'Evan Putra Hartono',      'gender' => 'Laki-laki', 'kelas_id' => $klsXipa1?->id,  'kelas_nama' => 'X IPA 1',    'kehadiran' => 95, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 90.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Buku Kimia Erlangga Kelas X',       'catatan' => 'Minat kuat di bidang kimia organik.'],
                ['nisn' => '0067000006', 'nama' => 'Febi Anggraini',          'gender' => 'Perempuan', 'kelas_id' => $klsXipa1?->id,  'kelas_nama' => 'X IPA 1',    'kehadiran' => 97, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 91.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Buku Biologi & Kimia Kelas X',      'catatan' => 'Aktif di KIR (Karya Ilmiah Remaja).'],
                // Kelas X IPS 1
                ['nisn' => '0067000010', 'nama' => 'Gery Pratama',            'gender' => 'Laki-laki', 'kelas_id' => $klsXips1?->id,  'kelas_nama' => 'X IPS 1',    'kehadiran' => 93, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 84.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Buku Ekonomi & Sosiologi',          'catatan' => 'Aktif di koperasi siswa.'],
                ['nisn' => '0067000011', 'nama' => 'Hilda Pratiwi Susanti',   'gender' => 'Perempuan', 'kelas_id' => $klsXips1?->id,  'kelas_nama' => 'X IPS 1',    'kehadiran' => 96, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 88.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'LKS Geografi & Ekonomi Kelas X',   'catatan' => 'Ketua mading sekolah.'],
                // Kelas XI MIPA 1
                ['nisn' => '0067000002', 'nama' => 'Bintang Mahardika',       'gender' => 'Laki-laki', 'kelas_id' => $klsXImipa?->id, 'kelas_nama' => 'XI MIPA 1',  'kehadiran' => 96, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 91.0, 'status_bantuan' => 'Belum Ada',         'kebutuhan' => 'Buku Persiapan SNBT & Olimpiade',  'catatan' => 'Ketua KIR SMAN 70.'],
                ['nisn' => '0067000003', 'nama' => 'Cindy Novitasari',        'gender' => 'Perempuan', 'kelas_id' => $klsXImipa?->id, 'kelas_nama' => 'XI MIPA 1',  'kehadiran' => 98, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 95.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Buku Fisika Halliday',              'catatan' => 'Semifinalis OSN Fisika tingkat Nasional.'],
                ['nisn' => '0067000004', 'nama' => 'Dandi Kurniawan',         'gender' => 'Laki-laki', 'kelas_id' => $klsXImipa?->id, 'kelas_nama' => 'XI MIPA 1',  'kehadiran' => 89, 'status_kehadiran' => 'Perhatian Khusus', 'nilai_rata_rata' => 75.5, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Bimbel Fisika & Matematika',        'catatan' => 'Perlu pendampingan untuk meningkatkan nilai.'],
                // Kelas XII MIPA 1
                ['nisn' => '0067000020', 'nama' => 'Irene Aprilia',           'gender' => 'Perempuan', 'kelas_id' => $klsXIImip?->id, 'kelas_nama' => 'XII MIPA 1', 'kehadiran' => 99, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 97.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Soal Try Out SNBT edisi terbaru',   'catatan' => 'Diterima di FK UI jalur prestasi.'],
                ['nisn' => '0067000021', 'nama' => 'Joko Susanto',            'gender' => 'Laki-laki', 'kelas_id' => $klsXIImip?->id, 'kelas_nama' => 'XII MIPA 1', 'kehadiran' => 94, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 88.0, 'status_bantuan' => 'Penerima KIP',      'kebutuhan' => 'Biaya Pendaftaran SNBT',            'catatan' => 'Target jurusan Teknik Informatika ITB.'],
            ];

            foreach ($students as $idx => $st) {
                Siswa::create(array_merge($st, [
                    'sekolah_id'    => $sma70->id,
                    'kode'          => 'SIS-SMA70-' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT),
                    'bantuan_badge' => $badgeFor($st['status_bantuan']),
                ]));
            }
        }

        // ==============================================================
        // 5. SMP NEGERI 45 PULAU SERIBU — Kelas 7A, 8A, 9A (3T)
        // ==============================================================
        if ($smp45) {
            $kls7aSeribu = Kelas::where('sekolah_id', $smp45->id)->where('nama', '7A')->first();
            $kls8aSeribu = Kelas::where('sekolah_id', $smp45->id)->where('nama', '8A')->first();
            $kls9aSeribu = Kelas::where('sekolah_id', $smp45->id)->where('nama', '9A')->first();

            $students = [
                // Kelas 7A
                ['nisn' => '0089880001', 'nama' => 'Fikri Haikal Pesisir',    'gender' => 'Laki-laki', 'kelas_id' => $kls7aSeribu?->id, 'kelas_nama' => '7A', 'kehadiran' => 88, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 84.0, 'status_bantuan' => 'Penerima KIP', 'kebutuhan' => 'Perahu Antar Jemput & Lampu Solar Belajar', 'catatan' => 'Menyeberang antar pulau setiap hari ke sekolah.'],
                ['nisn' => '0089880002', 'nama' => 'Salma Bahari',            'gender' => 'Perempuan', 'kelas_id' => $kls7aSeribu?->id, 'kelas_nama' => '7A', 'kehadiran' => 90, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 86.5, 'status_bantuan' => 'Penerima KIP', 'kebutuhan' => 'Buku Sains Maritim & Sepatu Karet',         'catatan' => 'Peringkat 1 di SMPN 45 Pulau Seribu.'],
                ['nisn' => '0089880003', 'nama' => 'Teguh Nelayan Pratama',   'gender' => 'Laki-laki', 'kelas_id' => $kls7aSeribu?->id, 'kelas_nama' => '7A', 'kehadiran' => 82, 'status_kehadiran' => 'Perhatian Khusus', 'nilai_rata_rata' => 76.0, 'status_bantuan' => 'Penerima KIP', 'kebutuhan' => 'Bantuan listrik solar panel rumah belajar',  'catatan' => 'Sering absen karena kondisi cuaca laut buruk.'],
                // Kelas 8A
                ['nisn' => '0089880010', 'nama' => 'Uni Sari Laut',           'gender' => 'Perempuan', 'kelas_id' => $kls8aSeribu?->id, 'kelas_nama' => '8A', 'kehadiran' => 91, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 85.0, 'status_bantuan' => 'Penerima KIP', 'kebutuhan' => 'Buku IPA Kelas 8 & Alat Lab Sederhana',    'catatan' => 'Bercita-cita menjadi ahli kelautan.'],
                ['nisn' => '0089880011', 'nama' => 'Vino Angin Samudra',      'gender' => 'Laki-laki', 'kelas_id' => $kls8aSeribu?->id, 'kelas_nama' => '8A', 'kehadiran' => 87, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 80.0, 'status_bantuan' => 'Belum Ada',   'kebutuhan' => 'Kalkulator & buku matematika',              'catatan' => 'Membantu orang tua sebagai nelayan di akhir pekan.'],
                // Kelas 9A
                ['nisn' => '0089880020', 'nama' => 'Wulan Pesisir Raya',      'gender' => 'Perempuan', 'kelas_id' => $kls9aSeribu?->id, 'kelas_nama' => '9A', 'kehadiran' => 93, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 89.0, 'status_bantuan' => 'Beasiswa Prestasi', 'kebutuhan' => 'Bimbel daring & kuota internet',    'catatan' => 'Target lulus dan kuliah di luar pulau.'],
                ['nisn' => '0089880021', 'nama' => 'Xander Bahari Putra',     'gender' => 'Laki-laki', 'kelas_id' => $kls9aSeribu?->id, 'kelas_nama' => '9A', 'kehadiran' => 85, 'status_kehadiran' => 'Baik',             'nilai_rata_rata' => 81.0, 'status_bantuan' => 'Penerima KIP', 'kebutuhan' => 'Biaya transport ke kota untuk PPDB',        'catatan' => 'Persiapan UN sambil bantu orang tua melaut.'],
            ];

            foreach ($students as $idx => $st) {
                Siswa::create(array_merge($st, [
                    'sekolah_id'    => $smp45->id,
                    'kode'          => 'SIS-SMP45-' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT),
                    'bantuan_badge' => $badgeFor($st['status_bantuan']),
                ]));
            }
        }
    }
}
