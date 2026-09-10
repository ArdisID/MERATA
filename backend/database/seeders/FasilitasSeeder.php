<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use App\Models\Sekolah;
use Illuminate\Database\Seeder;

class FasilitasSeeder extends Seeder
{
    public function run(): void
    {
        $smp1 = Sekolah::where('npsn', '20108942')->first();
        $smk26 = Sekolah::where('npsn', '20102601')->first();
        $sd03 = Sekolah::where('npsn', '20105521')->first();
        $sma70 = Sekolah::where('npsn', '20107001')->first();
        $smp45 = Sekolah::where('npsn', '20109881')->first();

        // 1. SMP Negeri 1 Merata
        if ($smp1) {
            $smpFacilities = [
                ['kode' => 'FAS-SMP1-001', 'nama' => 'Laboratorium Komputer & Server ANBK', 'lokasi' => 'Gedung A Lt. 2', 'kondisi' => 'Rusak Ringan', 'kondisi_badge' => 'bg-amber-50 text-amber-700 border-amber-200', 'jumlah_total' => 35, 'jumlah_baik' => 20, 'jumlah_rusak' => 15, 'keterangan' => '15 unit PC mati daya / perlu upgrade RAM & SSD.', 'kebutuhan_tambahan' => '15 Unit PC Baru & Switch 24-Port', 'terakhir_cek' => '25 Agt 2026'],
                ['kode' => 'FAS-SMP1-002', 'nama' => 'Laboratorium IPA & Biologi', 'lokasi' => 'Gedung B Lt. 1', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 40, 'jumlah_baik' => 38, 'jumlah_rusak' => 2, 'keterangan' => 'Kondisi mikroskop dan wastafel berfungsi normal.', 'kebutuhan_tambahan' => 'Reagen kimia dasar & 5 Mikroskop Binokuler', 'terakhir_cek' => '20 Agt 2026'],
                ['kode' => 'FAS-SMP1-003', 'nama' => 'Perpustakaan & Pojok Literasi', 'lokasi' => 'Gedung C Lt. 1', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 1200, 'jumlah_baik' => 1150, 'jumlah_rusak' => 50, 'keterangan' => 'Koleksi buku Kurikulum Merdeka terindeks rapi.', 'kebutuhan_tambahan' => 'Sistem e-Library & Barcode Scanner', 'terakhir_cek' => '24 Agt 2026'],
            ];
            foreach ($smpFacilities as $f) {
                Fasilitas::create(array_merge($f, ['sekolah_id' => $smp1->id]));
            }
        }

        // 2. SMK Negeri 26 Jakarta
        if ($smk26) {
            $smkFacilities = [
                ['kode' => 'FAS-SMK26-001', 'nama' => 'Bengkel Jaringan & Fiber Optic (TKJ)', 'lokasi' => 'Gedung Kejuruan Lt. 1', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 45, 'jumlah_baik' => 40, 'jumlah_rusak' => 5, 'keterangan' => 'Perangkat OTDR dan Fusion Splicer berfungsi dengan baik.', 'kebutuhan_tambahan' => 'Kit Praktik Fiber Optic FTTH 10 Set', 'terakhir_cek' => '28 Agt 2026'],
                ['kode' => 'FAS-SMK26-002', 'nama' => 'Lab Software Development & Cloud (RPL)', 'lokasi' => 'Gedung Kejuruan Lt. 2', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 40, 'jumlah_baik' => 38, 'jumlah_rusak' => 2, 'keterangan' => 'Spesifikasi PC Core i7 16GB RAM sangat memadai.', 'kebutuhan_tambahan' => 'Akses Server GPU untuk AI & Machine Learning', 'terakhir_cek' => '27 Agt 2026'],
                ['kode' => 'FAS-SMK26-003', 'nama' => 'Server Room & Data Center Edukasi', 'lokasi' => 'Gedung Rektorat Lt. 3', 'kondisi' => 'Rusak Ringan', 'kondisi_badge' => 'bg-amber-50 text-amber-700 border-amber-200', 'jumlah_total' => 4, 'jumlah_baik' => 3, 'jumlah_rusak' => 1, 'keterangan' => '1 unit UPS 10kVA memerlukan penggantian baterai modul.', 'kebutuhan_tambahan' => 'Penggantian baterai UPS & AC Inverter Server', 'terakhir_cek' => '29 Agt 2026'],
            ];
            foreach ($smkFacilities as $f) {
                Fasilitas::create(array_merge($f, ['sekolah_id' => $smk26->id]));
            }
        }

        // 3. SD Negeri Merata 03
        if ($sd03) {
            $sdFacilities = [
                ['kode' => 'FAS-SD03-001', 'nama' => 'Pojok Baca & Literasi Ramah Anak', 'lokasi' => 'Gedung Utama Lt. 1', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 400, 'jumlah_baik' => 380, 'jumlah_rusak' => 20, 'keterangan' => 'Tempat membaca berkarpet empuk untuk siswa kelas 1-6.', 'kebutuhan_tambahan' => '200 Judul Ensiklopedia & Cerita Bergambar', 'terakhir_cek' => '26 Agt 2026'],
                ['kode' => 'FAS-SD03-002', 'nama' => 'Ruang UKS & Timbangan Gizi MBG', 'lokasi' => 'Gedung Utama Lt. 1', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 6, 'jumlah_baik' => 6, 'jumlah_rusak' => 0, 'keterangan' => 'Timbangan digital dan alat ukur tinggi badan lengkap.', 'kebutuhan_tambahan' => 'P3K kit dan tempat tidur periksa tambahan', 'terakhir_cek' => '28 Agt 2026'],
            ];
            foreach ($sdFacilities as $f) {
                Fasilitas::create(array_merge($f, ['sekolah_id' => $sd03->id]));
            }
        }

        // 4. SMA Negeri 70 Jakarta
        if ($sma70) {
            $smaFacilities = [
                ['kode' => 'FAS-SMA70-001', 'nama' => 'Laboratorium Riset Sains & Bioteknologi', 'lokasi' => 'Gedung Sains Lt. 2', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 50, 'jumlah_baik' => 48, 'jumlah_rusak' => 2, 'keterangan' => 'Digunakan riset olimpiade sains & karya tulis ilmiah.', 'kebutuhan_tambahan' => 'Mikroskop Fase Kontras Digital', 'terakhir_cek' => '25 Agt 2026'],
            ];
            foreach ($smaFacilities as $f) {
                Fasilitas::create(array_merge($f, ['sekolah_id' => $sma70->id]));
            }
        }

        // 5. SMP Negeri 45 Pulau Seribu
        if ($smp45) {
            $seribuFacilities = [
                ['kode' => 'FAS-SMP45-001', 'nama' => 'Pembangkit Listrik Solar Cell & Genset', 'lokasi' => 'Area Belakang Sekolah', 'kondisi' => 'Rusak Ringan', 'kondisi_badge' => 'bg-amber-50 text-amber-700 border-amber-200', 'jumlah_total' => 12, 'jumlah_baik' => 8, 'jumlah_rusak' => 4, 'keterangan' => '4 baterai solar panel mengalami penurunan daya simpan.', 'kebutuhan_tambahan' => '4 Unit Baterai Lithium Solar 48V 100Ah', 'terakhir_cek' => '22 Agt 2026'],
                ['kode' => 'FAS-SMP45-002', 'nama' => 'Lab Komputer Pesisir (15 Unit Laptop)', 'lokasi' => 'Ruang 3T Lantai 1', 'kondisi' => 'Baik', 'kondisi_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'jumlah_total' => 15, 'jumlah_baik' => 15, 'jumlah_rusak' => 0, 'keterangan' => 'Laptop bantuan DAK terisi materi pembelajaran offline.', 'kebutuhan_tambahan' => 'Router Satelit Starlink untuk Ujian Online', 'terakhir_cek' => '24 Agt 2026'],
            ];
            foreach ($seribuFacilities as $f) {
                Fasilitas::create(array_merge($f, ['sekolah_id' => $smp45->id]));
            }
        }
    }
}
