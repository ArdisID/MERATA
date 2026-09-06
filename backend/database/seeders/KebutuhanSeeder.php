<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Kebutuhan;
use App\Models\Sekolah;
use Illuminate\Database\Seeder;

class KebutuhanSeeder extends Seeder
{
    public function run(): void
    {
        $sekolah = Sekolah::where('npsn', '20108942')->first();
        $guruBudi = Guru::where('kode', 'GUR-001')->first();
        $guruDewi = Guru::where('kode', 'GUR-002')->first();

        // From mockAdminData.js → initialVerifications (4 verifikasi entries)
        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'guru_id' => $guruBudi?->id,
            'kode' => 'VRF-001',
            'judul' => 'Pengadaan Laptop Lab IPA & TIK (15 Unit)',
            'kategori' => 'Peralatan IT & Digital',
            'pemohon' => 'Budi Santoso, S.Kom',
            'peran_pemohon' => 'Kepala Lab Komputer',
            'tanggal' => '28 Agt 2026',
            'urgensi' => 'Mendesak',
            'urgensi_badge' => 'bg-red-50 text-red-700 border-red-200',
            'estimasi_biaya' => 'Rp 105.000.000',
            'justifikasi' => 'Persiapan pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) dan pembelajaran coding siswa.',
            'status' => 'menunggu',
            'status_label' => 'Menunggu Verifikasi',
            'catatan_admin' => '',
            'lampiran' => 'Proposal_ANBK_2026.pdf (1.2 MB)',
            'tipe' => 'verifikasi',
        ]);

        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'VRF-002',
            'judul' => 'Pembaruan Server & Data Dapodik Semester 1',
            'kategori' => 'Administrasi Data',
            'pemohon' => 'Siti Rahmawati',
            'peran_pemohon' => 'Staf Tata Usaha',
            'tanggal' => '27 Agt 2026',
            'urgensi' => 'Mendesak',
            'urgensi_badge' => 'bg-red-50 text-red-700 border-red-200',
            'estimasi_biaya' => 'Rp 8.500.000',
            'justifikasi' => 'Peremajaan SSD server backup dan integrasi API data bantuan sosial siswa.',
            'status' => 'disetujui_sekolah',
            'status_label' => 'Disetujui Sekolah',
            'catatan_admin' => 'Disetujui oleh Kepala Sekolah. Diteruskan ke anggaran BOS Reguler.',
            'lampiran' => 'Rincian_Teknis_Server.pdf (450 KB)',
            'tipe' => 'verifikasi',
        ]);

        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'VRF-003',
            'judul' => 'Perbaikan Plafon & Atap Ruang Kelas 7B',
            'kategori' => 'Pemeliharaan Sarpras',
            'pemohon' => 'Ahmad Fauzi',
            'peran_pemohon' => 'Koordinator Sarpras',
            'tanggal' => '26 Agt 2026',
            'urgensi' => 'Mendesak',
            'urgensi_badge' => 'bg-red-50 text-red-700 border-red-200',
            'estimasi_biaya' => 'Rp 14.200.000',
            'justifikasi' => 'Plafon retak berisiko membahayakan 36 siswa saat kegiatan belajar mengajar berlangsung.',
            'status' => 'diteruskan_pemda',
            'status_label' => 'Diteruskan ke Pemerintah',
            'catatan_admin' => 'Diteruskan ke Dinas Pendidikan DKI Jakarta melalui program DAK Fisik.',
            'lampiran' => 'Foto_Kerusakan_Plafon.pdf (3.8 MB)',
            'tipe' => 'verifikasi',
        ]);

        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'guru_id' => $guruDewi?->id,
            'kode' => 'VRF-004',
            'judul' => 'Pelatihan Kurikulum Merdeka Guru Mapel Sains',
            'kategori' => 'Pelatihan Guru',
            'pemohon' => 'Dewi Lestari, M.Pd.',
            'peran_pemohon' => 'Wali Kelas 8B & Tim Kurikulum',
            'tanggal' => '24 Agt 2026',
            'urgensi' => 'Sedang',
            'urgensi_badge' => 'bg-blue-50 text-blue-700 border-blue-200',
            'estimasi_biaya' => 'Rp 4.000.000',
            'justifikasi' => 'Workshop pembuatan modul ajar digital berbasis STEM interaktif untuk 6 guru IPA & Matematika.',
            'status' => 'menunggu',
            'status_label' => 'Menunggu Verifikasi',
            'catatan_admin' => '',
            'lampiran' => 'Silabus_Pelatihan_STEM.pdf (820 KB)',
            'tipe' => 'verifikasi',
        ]);

        // From mockGuruData.js → initialTeacherNeeds (3 kebutuhan guru entries)
        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'guru_id' => $guruBudi?->id,
            'kode' => 'TND-01',
            'judul' => '15 Unit Laptop Lab Komputer & ANBK',
            'kategori' => 'Perangkat Pembelajaran IT',
            'tanggal' => '28 Agt 2026',
            'status' => 'menunggu',
            'status_label' => 'Menunggu Verifikasi Sekolah',
            'biaya' => 'Rp 105.000.000',
            'keterangan' => 'Untuk pembelajaran praktikum coding dan asesmen siswa.',
            'tipe' => 'kebutuhan_guru',
            'pemohon' => 'Budi Santoso, S.Kom',
            'peran_pemohon' => 'Kepala Lab Komputer & Guru TIK',
        ]);

        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'guru_id' => $guruBudi?->id,
            'kode' => 'TND-02',
            'judul' => 'Kit Alat Peraga Matematika 3D & Pecahan',
            'kategori' => 'Bahan Ajar & Alat Peraga',
            'tanggal' => '15 Agt 2026',
            'status' => 'diteruskan_pemda',
            'status_label' => 'Disetujui Sekolah & Diteruskan ke Pemda',
            'biaya' => 'Rp 3.500.000',
            'keterangan' => 'Peraga visual bentuk pecahan untuk 3 rombel Fase C.',
            'tipe' => 'kebutuhan_guru',
            'pemohon' => 'Budi Santoso, S.Kom',
            'peran_pemohon' => 'Kepala Lab Komputer & Guru TIK',
        ]);

        Kebutuhan::create([
            'sekolah_id' => $sekolah?->id,
            'guru_id' => $guruBudi?->id,
            'kode' => 'TND-03',
            'judul' => 'Pelatihan Pembuatan Media Ajar Berbasis STEM',
            'kategori' => 'Pelatihan Guru',
            'tanggal' => '10 Agt 2026',
            'status' => 'diterima',
            'status_label' => 'Bantuan Diterima',
            'biaya' => 'Gratis (Program Daring)',
            'keterangan' => 'Sertifikat telah diterbitkan oleh Balai Guru Penggerak.',
            'tipe' => 'kebutuhan_guru',
            'pemohon' => 'Budi Santoso, S.Kom',
            'peran_pemohon' => 'Kepala Lab Komputer & Guru TIK',
        ]);
    }
}
