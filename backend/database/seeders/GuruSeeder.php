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
        $smp1 = Sekolah::where('npsn', '20108942')->first();
        $smk26 = Sekolah::where('npsn', '20102601')->first();
        $sd03 = Sekolah::where('npsn', '20105521')->first();
        $sma70 = Sekolah::where('npsn', '20107001')->first();
        $smp45 = Sekolah::where('npsn', '20109881')->first();

        $userGuruSmp1 = User::where('email', 'guru@merata.id')->first();
        $userGuruSmk26 = User::where('email', 'guru.smk26@merata.id')->first();
        $userGuruSd03 = User::where('email', 'guru.sd03@merata.id')->first();
        $userGuruSma70 = User::where('email', 'guru.sma70@merata.id')->first();
        $userGuruSmp45 = User::where('email', 'guru.smp45@merata.id')->first();

        // 1. Guru SMP Negeri 1 Merata
        Guru::create([
            'user_id' => $userGuruSmp1?->id,
            'sekolah_id' => $smp1?->id,
            'kode' => 'GUR-SMP1-001',
            'nip' => '198203152006041003',
            'nama' => 'Budi Santoso, S.Kom',
            'gender' => 'Laki-laki',
            'mapel' => 'Informatika & TIK',
            'kelas_ajar' => ['7A', '8A', '9A'],
            'jabatan' => 'Kepala Lab Komputer & Guru TIK',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2015)',
            'pendidikan' => 'S1 Pendidikan Ilmu Komputer',
            'lama_mengajar' => '18 Tahun',
            'poin_kontribusi' => 450,
            'kebutuhan' => 'Peremajaan 15 unit PC Lab, Lisensi OS/Software Edukasi, Akses Internet 100 Mbps',
            'telepon' => '0812-3456-7890',
            'email' => 'guru@merata.id',
            'avatar' => $userGuruSmp1?->avatar,
        ]);

        Guru::create([
            'sekolah_id' => $smp1?->id,
            'kode' => 'GUR-SMP1-002',
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
            'email' => 'dewi.lestari@smpn1merata.sch.id',
        ]);

        Guru::create([
            'sekolah_id' => $smp1?->id,
            'kode' => 'GUR-SMP1-003',
            'nip' => '197601052002121004',
            'nama' => 'Drs. Bambang Sudarmono',
            'gender' => 'Laki-laki',
            'mapel' => 'IPA Terpadu (Fisika & Biologi)',
            'kelas_ajar' => ['7A', '7B', '9B'],
            'jabatan' => 'Kepala Lab IPA & Pembina OSN IPA',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2010)',
            'pendidikan' => 'S1 Pendidikan Fisika',
            'lama_mengajar' => '22 Tahun',
            'poin_kontribusi' => 520,
            'kebutuhan' => 'Mikroskop Digital USB, Reagen Kimia Dasar, Torso Anatomi Manusia',
            'telepon' => '0811-2345-6789',
            'email' => 'bambang.s@smpn1merata.sch.id',
        ]);

        // 2. Guru SMK Negeri 26 Jakarta
        Guru::create([
            'user_id' => $userGuruSmk26?->id,
            'sekolah_id' => $smk26?->id,
            'kode' => 'GUR-SMK26-001',
            'nip' => '198705122010011008',
            'nama' => 'Rizky Saputra, S.Pd., M.Kom.',
            'gender' => 'Laki-laki',
            'mapel' => 'Teknik Jaringan Komputer & Cyber Security',
            'kelas_ajar' => ['X TKJ 1', 'XI TKJ 1', 'XII TKJ 1'],
            'jabatan' => 'Kepala Bengkel TKJ & Asesor LSP',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2018)',
            'pendidikan' => 'S2 Teknik Informatika',
            'lama_mengajar' => '14 Tahun',
            'poin_kontribusi' => 480,
            'kebutuhan' => 'Router Cisco Enterprise, Server Rackmount 2U, Switch Managed Layer 3',
            'telepon' => '0812-7788-9900',
            'email' => 'guru.smk26@merata.id',
            'avatar' => $userGuruSmk26?->avatar,
        ]);

        Guru::create([
            'sekolah_id' => $smk26?->id,
            'kode' => 'GUR-SMK26-002',
            'nip' => '199002142015022003',
            'nama' => 'Siti Nurhaliza, S.T.',
            'gender' => 'Perempuan',
            'mapel' => 'Rekayasa Perangkat Lunak (RPL)',
            'kelas_ajar' => ['X RPL 1', 'XI RPL 1', 'XII RPL 1'],
            'jabatan' => 'Ketua Konsentrasi Keahlian RPL',
            'status_kepegawaian' => 'PPPK',
            'sertifikasi' => 'Sudah Sertifikasi (2021)',
            'pendidikan' => 'S1 Sistem Informasi',
            'lama_mengajar' => '9 Tahun',
            'poin_kontribusi' => 340,
            'kebutuhan' => 'Lisensi Cloud Server AWS / Google Cloud untuk Praktik DevOps',
            'telepon' => '0813-1122-3344',
            'email' => 'siti.rpl@smkn26jkt.sch.id',
        ]);

        // 3. Guru SD Negeri Merata 03
        Guru::create([
            'user_id' => $userGuruSd03?->id,
            'sekolah_id' => $sd03?->id,
            'kode' => 'GUR-SD03-001',
            'nip' => '198904152014031005',
            'nama' => 'Satria Wijaya, S.Pd.',
            'gender' => 'Laki-laki',
            'mapel' => 'Guru Kelas 5 (Tematik & Matematika Dasar)',
            'kelas_ajar' => ['5A', '5B'],
            'jabatan' => 'Wali Kelas 5A & Koordinator Literasi',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2018)',
            'pendidikan' => 'S1 PGSD',
            'lama_mengajar' => '10 Tahun',
            'poin_kontribusi' => 310,
            'kebutuhan' => 'Buku Bacaan Pojok Literasi, Smart Screen Edukasi Anak',
            'telepon' => '0812-4455-6677',
            'email' => 'guru.sd03@merata.id',
            'avatar' => $userGuruSd03?->avatar,
        ]);

        // 4. Guru SMA Negeri 70 Jakarta
        Guru::create([
            'user_id' => $userGuruSma70?->id,
            'sekolah_id' => $sma70?->id,
            'kode' => 'GUR-SMA70-001',
            'nip' => '198411202009022004',
            'nama' => 'Annisa Kusumawardhani, S.Pd., M.Pd.',
            'gender' => 'Perempuan',
            'mapel' => 'Biologi Lanjut & Riset Lingkungan',
            'kelas_ajar' => ['X IPA 1', 'XI MIPA 1', 'XII MIPA 1'],
            'jabatan' => 'Koordinator Olimpiade Biologi & Karya Ilmiah Remaja',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2014)',
            'pendidikan' => 'S2 Biologi',
            'lama_mengajar' => '15 Tahun',
            'poin_kontribusi' => 490,
            'kebutuhan' => 'Spektrofotometer mini, Kit Elektroforesis DNA Gel sederhana',
            'telepon' => '0811-9988-7766',
            'email' => 'guru.sma70@merata.id',
            'avatar' => $userGuruSma70?->avatar,
        ]);

        // 5. Guru SMP Negeri 45 Pulau Seribu
        Guru::create([
            'user_id' => $userGuruSmp45?->id,
            'sekolah_id' => $smp45?->id,
            'kode' => 'GUR-SMP45-001',
            'nip' => '198606182011012012',
            'nama' => 'Indah Saputra, S.Pd., M.Pd.',
            'gender' => 'Perempuan',
            'mapel' => 'Bahasa Indonesia & Literasi Maritim',
            'kelas_ajar' => ['7A', '8A', '9A'],
            'jabatan' => 'Wakil Kurikulum & Penggerak Literasi Pesisir',
            'status_kepegawaian' => 'PNS',
            'sertifikasi' => 'Sudah Sertifikasi (2016)',
            'pendidikan' => 'S2 Pendidikan Bahasa Indonesia',
            'lama_mengajar' => '13 Tahun',
            'poin_kontribusi' => 420,
            'kebutuhan' => 'Tablet Pembelajaran Offline, Paket Buku Bacaan Anak Pesisir, Solar Charger',
            'telepon' => '0813-8899-0011',
            'email' => 'guru.smp45@merata.id',
            'avatar' => $userGuruSmp45?->avatar,
        ]);
    }
}
