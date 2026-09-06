<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use App\Models\Sekolah;
use Illuminate\Database\Seeder;

class FasilitasSeeder extends Seeder
{
    public function run(): void
    {
        $sekolah = Sekolah::where('npsn', '20108942')->first();

        // From mockAdminData.js → initialFacilities (4 fasilitas)
        $facilities = [
            [
                'kode' => 'FAS-001',
                'nama' => 'Laboratorium Komputer 1',
                'lokasi' => 'Gedung A Lantai 2',
                'kondisi' => 'Rusak Ringan',
                'kondisi_badge' => 'bg-amber-50 text-amber-700 border-amber-200',
                'jumlah_total' => 35,
                'jumlah_baik' => 20,
                'jumlah_rusak' => 15,
                'keterangan' => '15 unit PC mati daya / perlu upgrade RAM & SSD untuk asesmen nasional.',
                'kebutuhan_tambahan' => '15 Unit PC Baru & 1 Unit Switch Gigabit 24-Port',
                'terakhir_cek' => '25 Agt 2026',
            ],
            [
                'kode' => 'FAS-002',
                'nama' => 'Laboratorium IPA & Biologi',
                'lokasi' => 'Gedung B Lantai 1',
                'kondisi' => 'Baik',
                'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'jumlah_total' => 40,
                'jumlah_baik' => 38,
                'jumlah_rusak' => 2,
                'keterangan' => 'Kondisi mikroskop dan wastafel praktikum berfungsi normal.',
                'kebutuhan_tambahan' => 'Reagen kimia dasar & 5 Mikroskop Binokuler',
                'terakhir_cek' => '20 Agt 2026',
            ],
            [
                'kode' => 'FAS-003',
                'nama' => 'Ruang Kelas 7B',
                'lokasi' => 'Gedung A Lantai 1',
                'kondisi' => 'Rusak Berat',
                'kondisi_badge' => 'bg-rose-50 text-rose-700 border-rose-200',
                'jumlah_total' => 36,
                'jumlah_baik' => 26,
                'jumlah_rusak' => 10,
                'keterangan' => 'Plafon bocor pada sisi timur dan 10 set meja kursi retak.',
                'kebutuhan_tambahan' => 'Perbaikan plafon atap & penggantian 10 set meja siswa',
                'terakhir_cek' => '26 Agt 2026',
            ],
            [
                'kode' => 'FAS-004',
                'nama' => 'Perpustakaan & Pojok Literasi',
                'lokasi' => 'Gedung C Lantai 1',
                'kondisi' => 'Baik',
                'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'jumlah_total' => 1200,
                'jumlah_baik' => 1150,
                'jumlah_rusak' => 50,
                'keterangan' => 'Koleksi buku Kurikulum Merdeka lengkap, ruang baca ber-AC.',
                'kebutuhan_tambahan' => '3 unit E-Reader Tablet & 200 Judul Buku Fiksi Edukasi',
                'terakhir_cek' => '22 Agt 2026',
            ],
        ];

        foreach ($facilities as $f) {
            Fasilitas::create(array_merge($f, [
                'sekolah_id' => $sekolah?->id,
            ]));
        }
    }
}
