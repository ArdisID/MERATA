<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Sekolah;
use Illuminate\Database\Seeder;

class KelasJadwalSeeder extends Seeder
{
    public function run(): void
    {
        $smp1 = Sekolah::where('npsn', '20108942')->first();
        $smk26 = Sekolah::where('npsn', '20102601')->first();
        $sd03 = Sekolah::where('npsn', '20105521')->first();
        $sma70 = Sekolah::where('npsn', '20107001')->first();
        $smp45 = Sekolah::where('npsn', '20109881')->first();

        // ================= 1. SMP NEGERI 1 MERATA =================
        if ($smp1) {
            $guruBudi = Guru::where('kode', 'GUR-SMP1-001')->first();
            $guruDewi = Guru::where('kode', 'GUR-SMP1-002')->first();
            $guruBambang = Guru::where('kode', 'GUR-SMP1-003')->first();

            $smpClasses = [
                ['nama' => '7A', 'tingkat' => '7', 'ruang' => 'Gedung A - Lt. 1 Ruang 101', 'wali' => $guruBudi],
                ['nama' => '7B', 'tingkat' => '7', 'ruang' => 'Gedung A - Lt. 1 Ruang 102', 'wali' => $guruBambang],
                ['nama' => '8A', 'tingkat' => '8', 'ruang' => 'Gedung B - Lt. 2 Ruang 201', 'wali' => $guruDewi],
                ['nama' => '8B', 'tingkat' => '8', 'ruang' => 'Gedung B - Lt. 2 Ruang 202', 'wali' => $guruDewi],
                ['nama' => '9A', 'tingkat' => '9', 'ruang' => 'Gedung C - Lt. 3 Ruang 301', 'wali' => $guruBudi],
                ['nama' => '9B', 'tingkat' => '9', 'ruang' => 'Gedung C - Lt. 3 Ruang 302', 'wali' => $guruBambang],
            ];

            foreach ($smpClasses as $idx => $sc) {
                $kls = Kelas::create([
                    'sekolah_id' => $smp1->id,
                    'kode' => 'KLS-SMP1-' . str_pad($idx + 1, 2, '0', STR_PAD_LEFT),
                    'nama' => $sc['nama'],
                    'tingkat' => $sc['tingkat'],
                    'ruang' => $sc['ruang'],
                    'wali_kelas_id' => $sc['wali']?->id,
                    'wali_kelas_nama' => $sc['wali']?->nama ?? 'Wali Kelas ' . $sc['nama'],
                    'total_siswa' => 30,
                    'laki_laki' => 15,
                    'perempuan' => 15,
                    'kehadiran_rata' => '96.5%',
                    'status' => 'Aktif',
                ]);

                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Senin', 'jam' => '07.30 - 09.30', 'mapel' => 'Informatika', 'guru_nama' => $guruBudi?->nama ?? 'Guru TIK']);
                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Selasa', 'jam' => '07.30 - 09.30', 'mapel' => 'Matematika', 'guru_nama' => $guruDewi?->nama ?? 'Guru Matematika']);
                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Rabu', 'jam' => '08.00 - 10.00', 'mapel' => 'IPA Terpadu', 'guru_nama' => $guruBambang?->nama ?? 'Guru IPA']);
            }
        }

        // ================= 2. SMK NEGERI 26 JAKARTA =================
        if ($smk26) {
            $guruRizky = Guru::where('kode', 'GUR-SMK26-001')->first();
            $guruSiti = Guru::where('kode', 'GUR-SMK26-002')->first();

            $smkClasses = [
                ['nama' => 'X TKJ 1', 'tingkat' => '10', 'ruang' => 'Bengkel Lab Jaringan 1', 'wali' => $guruRizky],
                ['nama' => 'X RPL 1', 'tingkat' => '10', 'ruang' => 'Lab Komputer Software 1', 'wali' => $guruSiti],
                ['nama' => 'XI TKJ 1', 'tingkat' => '11', 'ruang' => 'Bengkel Lab Jaringan 2', 'wali' => $guruRizky],
                ['nama' => 'XI RPL 1', 'tingkat' => '11', 'ruang' => 'Lab Komputer Software 2', 'wali' => $guruSiti],
                ['nama' => 'XII TKJ 1', 'tingkat' => '12', 'ruang' => 'Lab CISCO Enterprise', 'wali' => $guruRizky],
                ['nama' => 'XII RPL 1', 'tingkat' => '12', 'ruang' => 'Lab Cloud Computing & Mobile Dev', 'wali' => $guruSiti],
            ];

            foreach ($smkClasses as $idx => $sc) {
                $kls = Kelas::create([
                    'sekolah_id' => $smk26->id,
                    'kode' => 'KLS-SMK26-' . str_pad($idx + 1, 2, '0', STR_PAD_LEFT),
                    'nama' => $sc['nama'],
                    'tingkat' => $sc['tingkat'],
                    'ruang' => $sc['ruang'],
                    'wali_kelas_id' => $sc['wali']?->id,
                    'wali_kelas_nama' => $sc['wali']?->nama ?? 'Wali Kelas ' . $sc['nama'],
                    'total_siswa' => 35,
                    'laki_laki' => 20,
                    'perempuan' => 15,
                    'kehadiran_rata' => '97.0%',
                    'status' => 'Aktif',
                ]);

                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Senin', 'jam' => '07.00 - 10.30', 'mapel' => 'Praktik Jaringan & Cloud', 'guru_nama' => $guruRizky?->nama ?? 'Guru TKJ']);
                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Selasa', 'jam' => '07.30 - 11.00', 'mapel' => 'Pemrograman Web & Mobile', 'guru_nama' => $guruSiti?->nama ?? 'Guru RPL']);
            }
        }

        // ================= 3. SD NEGERI MERATA 03 =================
        if ($sd03) {
            $guruSatria = Guru::where('kode', 'GUR-SD03-001')->first();

            $sdClasses = [
                ['nama' => '1A', 'tingkat' => '1', 'ruang' => 'Ruang Kelas 1A'],
                ['nama' => '2A', 'tingkat' => '2', 'ruang' => 'Ruang Kelas 2A'],
                ['nama' => '3A', 'tingkat' => '3', 'ruang' => 'Ruang Kelas 3A'],
                ['nama' => '4A', 'tingkat' => '4', 'ruang' => 'Ruang Kelas 4A'],
                ['nama' => '5A', 'tingkat' => '5', 'ruang' => 'Ruang Kelas 5A', 'wali' => $guruSatria],
                ['nama' => '6A', 'tingkat' => '6', 'ruang' => 'Ruang Kelas 6A'],
            ];

            foreach ($sdClasses as $idx => $sc) {
                $kls = Kelas::create([
                    'sekolah_id' => $sd03->id,
                    'kode' => 'KLS-SD03-' . str_pad($idx + 1, 2, '0', STR_PAD_LEFT),
                    'nama' => $sc['nama'],
                    'tingkat' => $sc['tingkat'],
                    'ruang' => $sc['ruang'],
                    'wali_kelas_id' => ($sc['wali'] ?? null)?->id,
                    'wali_kelas_nama' => ($sc['wali'] ?? null)?->nama ?? 'Wali Kelas ' . $sc['nama'],
                    'total_siswa' => 28,
                    'laki_laki' => 14,
                    'perempuan' => 14,
                    'kehadiran_rata' => '96.2%',
                    'status' => 'Aktif',
                ]);

                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Senin', 'jam' => '07.00 - 08.45', 'mapel' => 'Tematik Terpadu', 'guru_nama' => $guruSatria?->nama ?? 'Guru Tematik']);
            }
        }

        // ================= 4. SMA NEGERI 70 JAKARTA =================
        if ($sma70) {
            $guruAnnisa = Guru::where('kode', 'GUR-SMA70-001')->first();

            $smaClasses = [
                ['nama' => 'X IPA 1', 'tingkat' => '10', 'ruang' => 'Lab Riset Biologi Lt. 2', 'wali' => $guruAnnisa],
                ['nama' => 'X IPS 1', 'tingkat' => '10', 'ruang' => 'Ruang 103 Gedung Utama'],
                ['nama' => 'XI MIPA 1', 'tingkat' => '11', 'ruang' => 'Ruang 201 Gedung Sains', 'wali' => $guruAnnisa],
                ['nama' => 'XII MIPA 1', 'tingkat' => '12', 'ruang' => 'Ruang 301 Gedung Sains'],
            ];

            foreach ($smaClasses as $idx => $sc) {
                $kls = Kelas::create([
                    'sekolah_id' => $sma70->id,
                    'kode' => 'KLS-SMA70-' . str_pad($idx + 1, 2, '0', STR_PAD_LEFT),
                    'nama' => $sc['nama'],
                    'tingkat' => $sc['tingkat'],
                    'ruang' => $sc['ruang'],
                    'wali_kelas_id' => ($sc['wali'] ?? null)?->id,
                    'wali_kelas_nama' => ($sc['wali'] ?? null)?->nama ?? 'Wali Kelas ' . $sc['nama'],
                    'total_siswa' => 36,
                    'laki_laki' => 18,
                    'perempuan' => 18,
                    'kehadiran_rata' => '97.5%',
                    'status' => 'Aktif',
                ]);

                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Senin', 'jam' => '07.30 - 09.30', 'mapel' => 'Biologi Riset', 'guru_nama' => $guruAnnisa?->nama ?? 'Guru Biologi']);
            }
        }

        // ================= 5. SMP NEGERI 45 PULAU SERIBU =================
        if ($smp45) {
            $guruIndah = Guru::where('kode', 'GUR-SMP45-001')->first();

            $seribuClasses = [
                ['nama' => '7A', 'tingkat' => '7', 'ruang' => 'Ruang Belajar Pesisir 1', 'wali' => $guruIndah],
                ['nama' => '8A', 'tingkat' => '8', 'ruang' => 'Ruang Belajar Pesisir 2', 'wali' => $guruIndah],
                ['nama' => '9A', 'tingkat' => '9', 'ruang' => 'Ruang Belajar Pesisir 3', 'wali' => $guruIndah],
            ];

            foreach ($seribuClasses as $idx => $sc) {
                $kls = Kelas::create([
                    'sekolah_id' => $smp45->id,
                    'kode' => 'KLS-SMP45-' . str_pad($idx + 1, 2, '0', STR_PAD_LEFT),
                    'nama' => $sc['nama'],
                    'tingkat' => $sc['tingkat'],
                    'ruang' => $sc['ruang'],
                    'wali_kelas_id' => ($sc['wali'] ?? null)?->id,
                    'wali_kelas_nama' => ($sc['wali'] ?? null)?->nama ?? 'Wali Kelas ' . $sc['nama'],
                    'total_siswa' => 25,
                    'laki_laki' => 13,
                    'perempuan' => 12,
                    'kehadiran_rata' => '89.2%',
                    'status' => 'Aktif',
                ]);

                Jadwal::create(['kelas_id' => $kls->id, 'hari' => 'Senin', 'jam' => '08.00 - 09.30', 'mapel' => 'Bahasa Indonesia & Literasi Maritim', 'guru_nama' => $guruIndah?->nama ?? 'Guru Bahasa']);
            }
        }
    }
}
