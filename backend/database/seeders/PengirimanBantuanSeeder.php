<?php

namespace Database\Seeders;

use App\Models\PengirimanBantuan;
use App\Models\Sekolah;
use Illuminate\Database\Seeder;

class PengirimanBantuanSeeder extends Seeder
{
    public function run(): void
    {
        $sekolah = Sekolah::where('npsn', '20108942')->first();

        // From mockAdminData.js → initialAssistanceShipments (3 shipments)
        PengirimanBantuan::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'SHP-001',
            'program' => 'Program Digitalisasi Sekolah Kemendikbudristek 2026',
            'sumber_dana' => 'DAK Fisik Kemendikbudristek 2026',
            'tahap' => 'Disalurkan',
            'tahap_index' => 4,
            'jumlah_item' => '20 Unit Chromebook & 1 Router Mesh',
            'ekspedisi' => 'PT Pos Logistik Indonesia (Resi: KEMDIK-LOG-8829104)',
            'status_kondisi' => 'Dalam Pengiriman Menuju SMP Negeri 1 Merata',
            'tanggal_kirim' => '25 Agt 2026',
            'estimasi_tiba' => '31 Agt 2026',
            'penerima' => 'Ahmad Fauzi (Sarpras)',
        ]);

        PengirimanBantuan::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'SHP-002',
            'program' => 'Bantuan Operasional Sekolah Kinerja (BOS Kinerja)',
            'sumber_dana' => 'Dinas Pendidikan Provinsi DKI Jakarta',
            'tahap' => 'Diterima',
            'tahap_index' => 5,
            'jumlah_item' => 'Dana Transfer Bank (Rp 65.000.000)',
            'ekspedisi' => 'Bank DKI Virtual Account (Resi: SP2D-DKI-2026-0912)',
            'status_kondisi' => 'Tercairkan & Terverifikasi di Rekening Sekolah',
            'tanggal_kirim' => '10 Agt 2026',
            'estimasi_tiba' => '12 Agt 2026',
            'penerima' => 'Dra. Hj. Sri Wahyuni, M.Pd. (Kepsek)',
        ]);

        PengirimanBantuan::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'SHP-003',
            'program' => 'Bantuan Penggantian Buku Teks Kurikulum Merdeka Fase D',
            'sumber_dana' => 'Pusat Kurikulum dan Perbukuan (Puskurjar)',
            'tahap' => 'Disetujui',
            'tahap_index' => 3,
            'jumlah_item' => '450 Eksemplar Buku Teks',
            'ekspedisi' => 'Balai Pustaka Ekspedisi (Resi: PUSKUR-BOK-2026-44)',
            'status_kondisi' => 'Sedang Proses Pengepakan Gudang',
            'tanggal_kirim' => 'Menunggu Jadwal Distribusi',
            'estimasi_tiba' => '08 Sep 2026',
            'penerima' => 'Ratna Sari, S.Pd. (Perpustakaan)',
        ]);
    }
}
