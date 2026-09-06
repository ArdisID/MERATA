<?php

namespace Database\Seeders;

use App\Models\Sekolah;
use App\Models\Siswa;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        $sekolah = Sekolah::where('npsn', '20108942')->first();

        // From mockAdminData.js → initialStudents (6 siswa)
        $students = [
            [
                'kode' => 'SIS-001',
                'nisn' => '0089123411',
                'nama' => 'Rian Pratama',
                'gender' => 'Laki-laki',
                'kelas_nama' => '8B',
                'kehadiran' => 72,
                'status_kehadiran' => 'Perhatian Khusus',
                'nilai_rata_rata' => 64.5,
                'status_bantuan' => 'Penerima KIP',
                'bantuan_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'kebutuhan' => 'Sepatu sekolah & Perlengkapan belajar',
                'catatan' => 'Tercatat absen berturut-turut 4 hari tanpa surat keterangan.',
                'riwayat_bantuan' => [
                    ['tahun' => '2025', 'jenis' => 'KIP Fase D', 'nilai' => 'Rp 750.000', 'status' => 'Tersalurkan'],
                    ['tahun' => '2026', 'jenis' => 'Bantuan Seragam Sekolah', 'nilai' => 'Barang', 'status' => 'Diterima'],
                ],
            ],
            [
                'kode' => 'SIS-002',
                'nisn' => '0089123412',
                'nama' => 'Siti Nurhaliza',
                'gender' => 'Perempuan',
                'kelas_nama' => '9A',
                'kehadiran' => 88,
                'status_kehadiran' => 'Perhatian Khusus',
                'nilai_rata_rata' => 89.2,
                'status_bantuan' => 'Usulan KIP (Menunggu)',
                'bantuan_badge' => 'bg-amber-50 text-amber-700 border-amber-200',
                'kebutuhan' => 'Bantuan KIP & Perangkat Belajar Digital',
                'catatan' => 'Dokumen KIP belum terverifikasi oleh operator sekolah.',
                'riwayat_bantuan' => [],
            ],
            [
                'kode' => 'SIS-003',
                'nisn' => '0089123413',
                'nama' => 'Aditya Pratama Putra',
                'gender' => 'Laki-laki',
                'kelas_nama' => '7A',
                'kehadiran' => 98,
                'status_kehadiran' => 'Baik',
                'nilai_rata_rata' => 94.0,
                'status_bantuan' => 'Beasiswa Prestasi',
                'bantuan_badge' => 'bg-blue-50 text-blue-700 border-blue-200',
                'kebutuhan' => 'Buku Olimpiade Sains',
                'catatan' => 'Juara 1 OSN Matematika Tingkat Kota.',
                'riwayat_bantuan' => [
                    ['tahun' => '2026', 'jenis' => 'Beasiswa Bakti Pendidikan', 'nilai' => 'Rp 1.200.000', 'status' => 'Tersalurkan'],
                ],
            ],
            [
                'kode' => 'SIS-004',
                'nisn' => '0089123414',
                'nama' => 'Aisyah Putri Azzahra',
                'gender' => 'Perempuan',
                'kelas_nama' => '8A',
                'kehadiran' => 96,
                'status_kehadiran' => 'Baik',
                'nilai_rata_rata' => 88.5,
                'status_bantuan' => 'Penerima KJP Plus',
                'bantuan_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'kebutuhan' => 'Kacamata minus untuk membaca papan tulis',
                'catatan' => 'Aktif dalam kegiatan OSIS dan Pramuka.',
                'riwayat_bantuan' => [
                    ['tahun' => '2025', 'jenis' => 'KJP Plus', 'nilai' => 'Rp 300.000 / bln', 'status' => 'Tersalurkan'],
                ],
            ],
            [
                'kode' => 'SIS-005',
                'nisn' => '0089123415',
                'nama' => 'Bagus Setiawan',
                'gender' => 'Laki-laki',
                'kelas_nama' => '9B',
                'kehadiran' => 92,
                'status_kehadiran' => 'Baik',
                'nilai_rata_rata' => 78.4,
                'status_bantuan' => 'Belum Ada',
                'bantuan_badge' => 'bg-gray-100 text-gray-700 border-gray-200',
                'kebutuhan' => '-',
                'catatan' => 'Kondisi belajar reguler, perlu peningkatan remedial IPA.',
                'riwayat_bantuan' => [],
            ],
            [
                'kode' => 'SIS-006',
                'nisn' => '0089123416',
                'nama' => 'Clarissa Maharani',
                'gender' => 'Perempuan',
                'kelas_nama' => '7B',
                'kehadiran' => 97,
                'status_kehadiran' => 'Baik',
                'nilai_rata_rata' => 91.0,
                'status_bantuan' => 'Penerima KIP',
                'bantuan_badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'kebutuhan' => 'Akses perangkat tablet perpustakaan',
                'catatan' => 'Tertarik pada literasi bahasa Inggris.',
                'riwayat_bantuan' => [
                    ['tahun' => '2026', 'jenis' => 'KIP Fase D', 'nilai' => 'Rp 750.000', 'status' => 'Tersalurkan'],
                ],
            ],
        ];

        foreach ($students as $student) {
            Siswa::create(array_merge($student, [
                'sekolah_id' => $sekolah?->id,
            ]));
        }
    }
}
