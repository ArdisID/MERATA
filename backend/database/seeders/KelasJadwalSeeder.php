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
        $sekolah = Sekolah::where('npsn', '20108942')->first();

        // From mockAdminData.js → initialClasses (3 kelas)
        $farhan = Guru::where('kode', 'GUR-005')->first();
        $dewi = Guru::where('kode', 'GUR-002')->first();

        // Kelas 7A
        $kls7a = Kelas::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'KLS-7A',
            'nama' => 'Kelas 7A',
            'tingkat' => 7,
            'ruang' => 'Gedung A - Lt. 1 Ruang 101',
            'wali_kelas_id' => $farhan?->id,
            'wali_kelas_nama' => 'Farhan Maulana, S.Pd.',
            'total_siswa' => 36,
            'laki_laki' => 18,
            'perempuan' => 18,
            'kehadiran_rata' => '97.2%',
            'status' => 'Aktif',
        ]);

        $jadwal7a = [
            ['hari' => 'Senin', 'jam' => '07.30 - 09.30', 'mapel' => 'Upacara & Bahasa Indonesia', 'guru_nama' => 'Ratna Sari, S.Pd.'],
            ['hari' => 'Selasa', 'jam' => '07.30 - 09.30', 'mapel' => 'Matematika', 'guru_nama' => 'Dewi Lestari, M.Pd.'],
            ['hari' => 'Rabu', 'jam' => '08.00 - 10.00', 'mapel' => 'Informatika (Lab Komputer)', 'guru_nama' => 'Budi Santoso, S.Kom'],
            ['hari' => 'Kamis', 'jam' => '07.30 - 09.30', 'mapel' => 'IPA Terpadu', 'guru_nama' => 'Drs. Bambang S.'],
            ['hari' => 'Jumat', 'jam' => '07.00 - 09.00', 'mapel' => 'PJOK (Lapangan Utama)', 'guru_nama' => 'Farhan Maulana, S.Pd.'],
        ];
        foreach ($jadwal7a as $j) {
            Jadwal::create(array_merge($j, ['kelas_id' => $kls7a->id]));
        }

        // Kelas 8B
        $kls8b = Kelas::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'KLS-8B',
            'nama' => 'Kelas 8B',
            'tingkat' => 8,
            'ruang' => 'Gedung B - Lt. 2 Ruang 204',
            'wali_kelas_id' => $dewi?->id,
            'wali_kelas_nama' => 'Dewi Lestari, M.Pd.',
            'total_siswa' => 38,
            'laki_laki' => 20,
            'perempuan' => 18,
            'kehadiran_rata' => '91.8%',
            'status' => 'Perlu Monitoring',
        ]);

        $jadwal8b = [
            ['hari' => 'Senin', 'jam' => '07.30 - 09.30', 'mapel' => 'Matematika Aljabar', 'guru_nama' => 'Dewi Lestari, M.Pd.'],
            ['hari' => 'Selasa', 'jam' => '07.30 - 09.30', 'mapel' => 'Bahasa Inggris', 'guru_nama' => 'Hendra Gunawan, M.Pd.'],
            ['hari' => 'Rabu', 'jam' => '08.00 - 10.00', 'mapel' => 'IPA Fisika', 'guru_nama' => 'Drs. Bambang S.'],
            ['hari' => 'Kamis', 'jam' => '07.30 - 09.30', 'mapel' => 'IPS Terpadu', 'guru_nama' => 'Siti Aminah, S.Pd.'],
            ['hari' => 'Jumat', 'jam' => '07.00 - 09.00', 'mapel' => 'Pendidikan Agama & Budi Pekerti', 'guru_nama' => 'H. Abdul Rozak, Lc.'],
        ];
        foreach ($jadwal8b as $j) {
            Jadwal::create(array_merge($j, ['kelas_id' => $kls8b->id]));
        }

        // Kelas 9A
        $kls9a = Kelas::create([
            'sekolah_id' => $sekolah?->id,
            'kode' => 'KLS-9A',
            'nama' => 'Kelas 9A',
            'tingkat' => 9,
            'ruang' => 'Gedung C - Lt. 1 Ruang 301',
            'wali_kelas_nama' => 'Hendro Wijaya, S.Si.',
            'total_siswa' => 35,
            'laki_laki' => 17,
            'perempuan' => 18,
            'kehadiran_rata' => '96.5%',
            'status' => 'Unggul',
        ]);

        $jadwal9a = [
            ['hari' => 'Senin', 'jam' => '07.30 - 09.30', 'mapel' => 'Pendalaman Materi IPA', 'guru_nama' => 'Drs. Bambang S.'],
            ['hari' => 'Selasa', 'jam' => '07.30 - 09.30', 'mapel' => 'Bahasa Indonesia Lanjutan', 'guru_nama' => 'Ratna Sari, S.Pd.'],
            ['hari' => 'Rabu', 'jam' => '08.00 - 10.00', 'mapel' => 'Matematika Terapan', 'guru_nama' => 'Dewi Lestari, M.Pd.'],
            ['hari' => 'Kamis', 'jam' => '07.30 - 09.30', 'mapel' => 'Simulasi CBT Informatika', 'guru_nama' => 'Budi Santoso, S.Kom'],
            ['hari' => 'Jumat', 'jam' => '07.00 - 09.00', 'mapel' => 'Pendidikan Kewarganegaraan', 'guru_nama' => 'Dra. Endang S.'],
        ];
        foreach ($jadwal9a as $j) {
            Jadwal::create(array_merge($j, ['kelas_id' => $kls9a->id]));
        }
    }
}
