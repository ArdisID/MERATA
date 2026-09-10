import {
  FileText,
  FileCheck2,
  Check,
  Send,
  PackageCheck
} from 'lucide-react';

export const initialSchoolProfile = {
  nama: 'SMP Negeri 1 Merata',
  npsn: '20108942',
  akreditasi: 'A (Unggul - Nilai 96)',
  statusSekolah: 'Negeri',
  jenjang: 'Sekolah Menengah Pertama (SMP)',
  kepalaSekolah: 'Dra. Hj. Sri Wahyuni, M.Pd.',
  nipKepsek: '197405121998032001',
  operator: 'Ahmad Fauzi, S.Pd.',
  alamat: 'Jl. Merata Raya No. 45, Kecamatan Kebayoran Baru, Jakarta Selatan',
  wilayah: 'Jakarta Selatan, DKI Jakarta',
  kodePos: '12180',
  telepon: '(021) 789-0123',
  email: 'info@smpn1merata.sch.id',
  website: 'https://smpn1merata.sch.id',
  kurikulum: 'Kurikulum Merdeka Mandiri Berbagi',
  foto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
  stats: {
    totalSiswa: 1248,
    trendSiswa: '+1% dari bulan lalu',
    totalGuru: 84,
    trendGuru: '+2 baru semester ini',
    totalKelas: 142,
    trendKelas: 'Stabil',
    tingkatKehadiran: '94.2%',
    trendKehadiran: '-0.5% minggu ini',
    labKomputer: 1,
    labIPA: 1
  }
};

export const initialStudents = [
  // ===== KELAS 7A =====
  {
    id: 'SIS-001',
    nisn: '0089123411',
    nama: 'Aditya Pratama Putra',
    gender: 'Laki-laki',
    kelas: '7A',
    kehadiran: 98,
    statusKehadiran: 'Baik',
    nilaiRataRata: 94.0,
    statusBantuan: 'Beasiswa Prestasi',
    bantuanBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    kebutuhan: 'Buku Olimpiade Sains',
    catatan: 'Juara 1 OSN Matematika Tingkat Kota.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'Beasiswa Bakti Pendidikan', nilai: 'Rp 1.200.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-002',
    nisn: '0089123412',
    nama: 'Rizky Aulia Ramadhan',
    gender: 'Laki-laki',
    kelas: '7A',
    kehadiran: 95,
    statusKehadiran: 'Baik',
    nilaiRataRata: 86.5,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Tas sekolah & Alat tulis',
    catatan: 'Aktif mengikuti kegiatan ekstrakurikuler robotik.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-003',
    nisn: '0089123413',
    nama: 'Nadia Putri Rahayu',
    gender: 'Perempuan',
    kelas: '7A',
    kehadiran: 100,
    statusKehadiran: 'Baik',
    nilaiRataRata: 97.2,
    statusBantuan: 'Beasiswa Prestasi',
    bantuanBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    kebutuhan: '-',
    catatan: 'Peringkat 1 semester ganjil. Wakil OSN Fisika.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-004',
    nisn: '0089123414',
    nama: 'Farhan Hidayatullah',
    gender: 'Laki-laki',
    kelas: '7A',
    kehadiran: 82,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 71.0,
    statusBantuan: 'Usulan KIP (Menunggu)',
    bantuanBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    kebutuhan: 'Seragam sekolah & biaya SPP',
    catatan: 'Sering izin karena membantu orang tua berdagang.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-005',
    nisn: '0089123415',
    nama: 'Dewi Kartika Sari',
    gender: 'Perempuan',
    kelas: '7A',
    kehadiran: 93,
    statusKehadiran: 'Baik',
    nilaiRataRata: 82.3,
    statusBantuan: 'Penerima KJP Plus',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: '-',
    catatan: 'Aktif di kegiatan Pramuka dan Paduan Suara.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KJP Plus', nilai: 'Rp 300.000 / bln', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-006',
    nisn: '0089123416',
    nama: 'Muhammad Ilham Saputra',
    gender: 'Laki-laki',
    kelas: '7A',
    kehadiran: 88,
    statusKehadiran: 'Baik',
    nilaiRataRata: 78.8,
    statusBantuan: 'Belum Ada',
    bantuanBadge: 'bg-gray-100 text-gray-700 border-gray-200',
    kebutuhan: 'Kamus Bahasa Inggris',
    catatan: 'Perlu bimbingan tambahan di pelajaran Bahasa Inggris.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-007',
    nisn: '0089123417',
    nama: 'Salma Azzahra Rahmadani',
    gender: 'Perempuan',
    kelas: '7A',
    kehadiran: 97,
    statusKehadiran: 'Baik',
    nilaiRataRata: 90.1,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Buku paket Matematika',
    catatan: 'Sangat aktif di kelas dan sering membantu teman.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-008',
    nisn: '0089123418',
    nama: 'Bintang Cahaya Nugroho',
    gender: 'Laki-laki',
    kelas: '7A',
    kehadiran: 76,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 62.5,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Sepatu & seragam olahraga',
    catatan: 'Tercatat 3 kali alpa dalam sebulan. Perlu kunjungan rumah.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },

  // ===== KELAS 8A =====
  {
    id: 'SIS-009',
    nisn: '0089123419',
    nama: 'Aisyah Putri Azzahra',
    gender: 'Perempuan',
    kelas: '8A',
    kehadiran: 96,
    statusKehadiran: 'Baik',
    nilaiRataRata: 88.5,
    statusBantuan: 'Penerima KJP Plus',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Kacamata minus untuk membaca papan tulis',
    catatan: 'Aktif dalam kegiatan OSIS dan Pramuka.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KJP Plus', nilai: 'Rp 300.000 / bln', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-010',
    nisn: '0089123420',
    nama: 'Daffa Arya Pratama',
    gender: 'Laki-laki',
    kelas: '8A',
    kehadiran: 90,
    statusKehadiran: 'Baik',
    nilaiRataRata: 83.0,
    statusBantuan: 'Belum Ada',
    bantuanBadge: 'bg-gray-100 text-gray-700 border-gray-200',
    kebutuhan: '-',
    catatan: 'Aktif di klub basket sekolah.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-011',
    nisn: '0089123421',
    nama: 'Putri Maulida Hasanah',
    gender: 'Perempuan',
    kelas: '8A',
    kehadiran: 99,
    statusKehadiran: 'Baik',
    nilaiRataRata: 95.3,
    statusBantuan: 'Beasiswa Prestasi',
    bantuanBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    kebutuhan: '-',
    catatan: 'Peringkat 1 di kelas 8A. Kandidat OSN IPA.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'Beasiswa Bakti Pendidikan', nilai: 'Rp 1.500.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-012',
    nisn: '0089123422',
    nama: 'Kevin Andrianto Susilo',
    gender: 'Laki-laki',
    kelas: '8A',
    kehadiran: 85,
    statusKehadiran: 'Baik',
    nilaiRataRata: 76.2,
    statusBantuan: 'Usulan KIP (Menunggu)',
    bantuanBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    kebutuhan: 'Laptop / tablet untuk belajar daring',
    catatan: 'Tidak memiliki perangkat belajar pribadi di rumah.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-013',
    nisn: '0089123423',
    nama: 'Anisa Nur Fadhilah',
    gender: 'Perempuan',
    kelas: '8A',
    kehadiran: 94,
    statusKehadiran: 'Baik',
    nilaiRataRata: 80.7,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Seragam batik sekolah',
    catatan: 'Aktif di kegiatan seni dan kerajinan tangan.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-014',
    nisn: '0089123424',
    nama: 'Rendra Mahardika Putra',
    gender: 'Laki-laki',
    kelas: '8A',
    kehadiran: 78,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 65.0,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Biaya les tambahan Matematika',
    catatan: 'Kesulitan di materi aljabar, butuh bimbingan intensif.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-015',
    nisn: '0089123425',
    nama: 'Zara Amelia Putri',
    gender: 'Perempuan',
    kelas: '8A',
    kehadiran: 100,
    statusKehadiran: 'Baik',
    nilaiRataRata: 91.8,
    statusBantuan: 'Belum Ada',
    bantuanBadge: 'bg-gray-100 text-gray-700 border-gray-200',
    kebutuhan: '-',
    catatan: 'Selalu hadir. Ketua kelas 8A semester ini.',
    riwayatBantuan: []
  },

  // ===== KELAS 8B =====
  {
    id: 'SIS-016',
    nisn: '0089123426',
    nama: 'Rian Pratama',
    gender: 'Laki-laki',
    kelas: '8B',
    kehadiran: 72,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 64.5,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Sepatu sekolah & Perlengkapan belajar',
    catatan: 'Tercatat absen berturut-turut 4 hari tanpa surat keterangan.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' },
      { tahun: '2026', jenis: 'Bantuan Seragam Sekolah', nilai: 'Barang', status: 'Diterima' }
    ]
  },
  {
    id: 'SIS-017',
    nisn: '0089123427',
    nama: 'Layla Mutiara Dewi',
    gender: 'Perempuan',
    kelas: '8B',
    kehadiran: 89,
    statusKehadiran: 'Baik',
    nilaiRataRata: 79.5,
    statusBantuan: 'Usulan KIP (Menunggu)',
    bantuanBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    kebutuhan: 'Biaya transportasi sekolah',
    catatan: 'Jarak rumah ke sekolah cukup jauh, butuh subsidi transport.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-018',
    nisn: '0089123428',
    nama: 'Arya Bagas Wicaksono',
    gender: 'Laki-laki',
    kelas: '8B',
    kehadiran: 91,
    statusKehadiran: 'Baik',
    nilaiRataRata: 74.2,
    statusBantuan: 'Belum Ada',
    bantuanBadge: 'bg-gray-100 text-gray-700 border-gray-200',
    kebutuhan: '-',
    catatan: 'Aktif di kegiatan paskibra sekolah.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-019',
    nisn: '0089123429',
    nama: 'Shafira Nur Indah',
    gender: 'Perempuan',
    kelas: '8B',
    kehadiran: 97,
    statusKehadiran: 'Baik',
    nilaiRataRata: 85.6,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Buku-buku paket IPA & IPS',
    catatan: 'Rajin dan aktif berdiskusi di kelas.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-020',
    nisn: '0089123430',
    nama: 'Fauzan Hakim Santoso',
    gender: 'Laki-laki',
    kelas: '8B',
    kehadiran: 65,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 58.0,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Pendampingan psikologis & bimbingan belajar',
    catatan: 'Terindikasi kesulitan belajar. Perlu evaluasi khusus dari BK.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-021',
    nisn: '0089123431',
    nama: 'Nayla Kharisma Utami',
    gender: 'Perempuan',
    kelas: '8B',
    kehadiran: 94,
    statusKehadiran: 'Baik',
    nilaiRataRata: 82.1,
    statusBantuan: 'Penerima KJP Plus',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: '-',
    catatan: 'Aktif sebagai bendahara OSIS.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KJP Plus', nilai: 'Rp 300.000 / bln', status: 'Tersalurkan' }
    ]
  },

  // ===== KELAS 9A =====
  {
    id: 'SIS-022',
    nisn: '0089123432',
    nama: 'Siti Nurhaliza',
    gender: 'Perempuan',
    kelas: '9A',
    kehadiran: 88,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 89.2,
    statusBantuan: 'Usulan KIP (Menunggu)',
    bantuanBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    kebutuhan: 'Bantuan KIP & Perangkat Belajar Digital',
    catatan: 'Dokumen KIP belum terverifikasi oleh operator sekolah.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-023',
    nisn: '0089123433',
    nama: 'Ahmad Zulfikar Ramadhan',
    gender: 'Laki-laki',
    kelas: '9A',
    kehadiran: 96,
    statusKehadiran: 'Baik',
    nilaiRataRata: 91.5,
    statusBantuan: 'Beasiswa Prestasi',
    bantuanBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    kebutuhan: 'Buku persiapan UN',
    catatan: 'Ketua OSIS. Berprestasi di kompetisi debat Bahasa Indonesia.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'Beasiswa Bakti Pendidikan', nilai: 'Rp 1.500.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-024',
    nisn: '0089123434',
    nama: 'Maharani Sekar Ayu',
    gender: 'Perempuan',
    kelas: '9A',
    kehadiran: 100,
    statusKehadiran: 'Baik',
    nilaiRataRata: 96.8,
    statusBantuan: 'Beasiswa Prestasi',
    bantuanBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    kebutuhan: '-',
    catatan: 'Peringkat 1 se-angkatan 9. Calon valedictorian.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'Beasiswa Bakti Pendidikan', nilai: 'Rp 1.200.000', status: 'Tersalurkan' },
      { tahun: '2026', jenis: 'Beasiswa Bakti Pendidikan', nilai: 'Rp 1.500.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-025',
    nisn: '0089123435',
    nama: 'Dimas Eka Prasetyo',
    gender: 'Laki-laki',
    kelas: '9A',
    kehadiran: 84,
    statusKehadiran: 'Perhatian Khusus',
    nilaiRataRata: 70.3,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Bimbingan belajar intensif UN',
    catatan: 'Nilai IPA & Matematika perlu ditingkatkan menjelang UN.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-026',
    nisn: '0089123436',
    nama: 'Intan Permata Sari',
    gender: 'Perempuan',
    kelas: '9A',
    kehadiran: 92,
    statusKehadiran: 'Baik',
    nilaiRataRata: 84.0,
    statusBantuan: 'Penerima KJP Plus',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: '-',
    catatan: 'Aktif di ekskul PMR dan jurnalistik sekolah.',
    riwayatBantuan: [
      { tahun: '2025', jenis: 'KJP Plus', nilai: 'Rp 300.000 / bln', status: 'Tersalurkan' }
    ]
  },
  {
    id: 'SIS-027',
    nisn: '0089123437',
    nama: 'Wahyu Tri Nugroho',
    gender: 'Laki-laki',
    kelas: '9A',
    kehadiran: 98,
    statusKehadiran: 'Baik',
    nilaiRataRata: 88.7,
    statusBantuan: 'Belum Ada',
    bantuanBadge: 'bg-gray-100 text-gray-700 border-gray-200',
    kebutuhan: '-',
    catatan: 'Siswa teladan. Aktif membantu persiapan kegiatan wisuda sekolah.',
    riwayatBantuan: []
  },

  // ===== KELAS LAINNYA (untuk Admin view) =====
  {
    id: 'SIS-028',
    nisn: '0089123438',
    nama: 'Bagus Setiawan',
    gender: 'Laki-laki',
    kelas: '9B',
    kehadiran: 92,
    statusKehadiran: 'Baik',
    nilaiRataRata: 78.4,
    statusBantuan: 'Belum Ada',
    bantuanBadge: 'bg-gray-100 text-gray-700 border-gray-200',
    kebutuhan: '-',
    catatan: 'Kondisi belajar reguler, perlu peningkatan remedial IPA.',
    riwayatBantuan: []
  },
  {
    id: 'SIS-029',
    nisn: '0089123439',
    nama: 'Clarissa Maharani',
    gender: 'Perempuan',
    kelas: '7B',
    kehadiran: 97,
    statusKehadiran: 'Baik',
    nilaiRataRata: 91.0,
    statusBantuan: 'Penerima KIP',
    bantuanBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    kebutuhan: 'Akses perangkat tablet perpustakaan',
    catatan: 'Tertarik pada literasi bahasa Inggris.',
    riwayatBantuan: [
      { tahun: '2026', jenis: 'KIP Fase D', nilai: 'Rp 750.000', status: 'Tersalurkan' }
    ]
  }
];

export const initialTeachers = [
  {
    id: 'GUR-001',
    nip: '198203152006041003',
    nama: 'Budi Santoso, S.Kom',
    gender: 'Laki-laki',
    mapel: 'Informatika & TIK',
    kelasAjar: ['7A', '8A', '9A', '9B'],
    jabatan: 'Kepala Lab Komputer & Guru TIK',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi (2015)',
    pendidikan: 'S1 Pendidikan Ilmu Komputer',
    lamaMengajar: '18 Tahun',
    poinKontribusi: 450,
    kebutuhan: 'Peremajaan 15 unit PC Lab, Lisensi OS/Software Edukasi, Akses Internet 100 Mbps',
    telepon: '0812-3456-7890',
    email: 'budi.santoso@guru.merata.id'
  },
  {
    id: 'GUR-002',
    nip: '198807212011012009',
    nama: 'Dewi Lestari, M.Pd.',
    gender: 'Perempuan',
    mapel: 'Matematika',
    kelasAjar: ['8A', '8B', '8C'],
    jabatan: 'Wali Kelas 8B & Tim Kurikulum',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi (2019)',
    pendidikan: 'S2 Pendidikan Matematika',
    lamaMengajar: '12 Tahun',
    poinKontribusi: 380,
    kebutuhan: 'Alat Peraga Geometri 3D, Proyektor Interaktif Kelas',
    telepon: '0813-9876-5432',
    email: 'dewi.lestari@guru.merata.id'
  },
  {
    id: 'GUR-003',
    nip: '197604122002121002',
    nama: 'Drs. Bambang Sudarmono',
    gender: 'Laki-laki',
    mapel: 'IPA Terpadu (Fisika)',
    kelasAjar: ['9A', '9B', '9C'],
    jabatan: 'Kepala Laboratorium IPA',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi (2010)',
    pendidikan: 'S1 Pendidikan Fisika',
    lamaMengajar: '24 Tahun',
    poinKontribusi: 520,
    kebutuhan: 'Kit Percobaan Optik, Neraca Ohaus Digital, Mikroskop Binokuler Tambahan',
    telepon: '0811-2233-4455',
    email: 'bambang.sudarmono@guru.merata.id'
  },
  {
    id: 'GUR-004',
    nip: '199305102022212015',
    nama: 'Ratna Sari, S.Pd.',
    gender: 'Perempuan',
    mapel: 'Bahasa Indonesia',
    kelasAjar: ['7A', '7B', '7C'],
    jabatan: 'Wali Kelas 7C & Pembina Jurnalistik',
    statusKepegawaian: 'PPPK',
    sertifikasi: 'Dalam Proses PPG',
    pendidikan: 'S1 Sastra & Pendidikan Bhs Indonesia',
    lamaMengajar: '5 Tahun',
    poinKontribusi: 210,
    kebutuhan: 'Buku Pengayaan Pojok Baca Kelas, Akses Platform E-Perpus Nasional',
    telepon: '0857-1122-3344',
    email: 'ratna.sari@guru.merata.id'
  },
  {
    id: 'GUR-005',
    nip: '-',
    nama: 'Farhan Maulana, S.Pd.',
    gender: 'Laki-laki',
    mapel: 'Pendidikan Jasmani & Kesehatan (PJOK)',
    kelasAjar: ['7A', '8A', '9A'],
    jabatan: 'Wali Kelas 7A & Koordinator Olahraga',
    statusKepegawaian: 'Honorer',
    sertifikasi: 'Belum Sertifikasi',
    pendidikan: 'S1 Kepelatihan Olahraga',
    lamaMengajar: '3 Tahun',
    poinKontribusi: 160,
    kebutuhan: 'Matras Senam Baru, Bola Basket Molten, Pelatihan P3K Keolahragaan',
    telepon: '0878-9988-7766',
    email: 'farhan.maulana@guru.merata.id'
  }
];

export const initialClasses = [
  {
    id: 'KLS-7A',
    tingkat: 7,
    nama: 'Kelas 7A',
    ruang: 'Gedung A - Lt. 1 Ruang 101',
    waliKelas: 'Farhan Maulana, S.Pd.',
    totalSiswa: 36,
    lakiLaki: 18,
    perempuan: 18,
    kehadiranRata: '97.2%',
    status: 'Aktif',
    jadwal: [
      { hari: 'Senin', jam: '07.30 - 09.30', mapel: 'Upacara & Bahasa Indonesia', guru: 'Ratna Sari, S.Pd.' },
      { hari: 'Selasa', jam: '07.30 - 09.30', mapel: 'Matematika', guru: 'Dewi Lestari, M.Pd.' },
      { hari: 'Rabu', jam: '08.00 - 10.00', mapel: 'Informatika (Lab Komputer)', guru: 'Budi Santoso, S.Kom' },
      { hari: 'Kamis', jam: '07.30 - 09.30', mapel: 'IPA Terpadu', guru: 'Drs. Bambang S.' },
      { hari: 'Jumat', jam: '07.00 - 09.00', mapel: 'PJOK (Lapangan Utama)', guru: 'Farhan Maulana, S.Pd.' }
    ]
  },
  {
    id: 'KLS-8B',
    tingkat: 8,
    nama: 'Kelas 8B',
    ruang: 'Gedung B - Lt. 2 Ruang 204',
    waliKelas: 'Dewi Lestari, M.Pd.',
    totalSiswa: 38,
    lakiLaki: 20,
    perempuan: 18,
    kehadiranRata: '91.8%',
    status: 'Perlu Monitoring',
    jadwal: [
      { hari: 'Senin', jam: '07.30 - 09.30', mapel: 'Matematika Aljabar', guru: 'Dewi Lestari, M.Pd.' },
      { hari: 'Selasa', jam: '07.30 - 09.30', mapel: 'Bahasa Inggris', guru: 'Hendra Gunawan, M.Pd.' },
      { hari: 'Rabu', jam: '08.00 - 10.00', mapel: 'IPA Fisika', guru: 'Drs. Bambang S.' },
      { hari: 'Kamis', jam: '07.30 - 09.30', mapel: 'IPS Terpadu', guru: 'Siti Aminah, S.Pd.' },
      { hari: 'Jumat', jam: '07.00 - 09.00', mapel: 'Pendidikan Agama & Budi Pekerti', guru: 'H. Abdul Rozak, Lc.' }
    ]
  },
  {
    id: 'KLS-9A',
    tingkat: 9,
    nama: 'Kelas 9A',
    ruang: 'Gedung C - Lt. 1 Ruang 301',
    waliKelas: 'Hendro Wijaya, S.Si.',
    totalSiswa: 35,
    lakiLaki: 17,
    perempuan: 18,
    kehadiranRata: '96.5%',
    status: 'Unggul',
    jadwal: [
      { hari: 'Senin', jam: '07.30 - 09.30', mapel: 'Pendalaman Materi IPA', guru: 'Drs. Bambang S.' },
      { hari: 'Selasa', jam: '07.30 - 09.30', mapel: 'Bahasa Indonesia Lanjutan', guru: 'Ratna Sari, S.Pd.' },
      { hari: 'Rabu', jam: '08.00 - 10.00', mapel: 'Matematika Terapan', guru: 'Dewi Lestari, M.Pd.' },
      { hari: 'Kamis', jam: '07.30 - 09.30', mapel: 'Simulasi CBT Informatika', guru: 'Budi Santoso, S.Kom' },
      { hari: 'Jumat', jam: '07.00 - 09.00', mapel: 'Pendidikan Kewarganegaraan', guru: 'Dra. Endang S.' }
    ]
  }
];

export const initialFacilities = [
  {
    id: 'FAS-001',
    nama: 'Laboratorium Komputer 1',
    lokasi: 'Gedung A Lantai 2',
    kondisi: 'Rusak Ringan',
    kondisiBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    jumlahTotal: 35,
    jumlahBaik: 20,
    jumlahRusak: 15,
    keterangan: '15 unit PC mati daya / perlu upgrade RAM & SSD untuk asesmen nasional.',
    kebutuhanTambahan: '15 Unit PC Baru & 1 Unit Switch Gigabit 24-Port',
    terakhirCek: '25 Agt 2026'
  },
  {
    id: 'FAS-002',
    nama: 'Laboratorium IPA & Biologi',
    lokasi: 'Gedung B Lantai 1',
    kondisi: 'Baik',
    kondisiBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    jumlahTotal: 40,
    jumlahBaik: 38,
    jumlahRusak: 2,
    keterangan: 'Kondisi mikroskop dan wastafel praktikum berfungsi normal.',
    kebutuhanTambahan: 'Reagen kimia dasar & 5 Mikroskop Binokuler',
    terakhirCek: '20 Agt 2026'
  },
  {
    id: 'FAS-003',
    nama: 'Ruang Kelas 7B',
    lokasi: 'Gedung A Lantai 1',
    kondisi: 'Rusak Berat',
    kondisiBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    jumlahTotal: 36,
    jumlahBaik: 26,
    jumlahRusak: 10,
    keterangan: 'Plafon bocor pada sisi timur dan 10 set meja kursi retak.',
    kebutuhanTambahan: 'Perbaikan plafon atap & penggantian 10 set meja siswa',
    terakhirCek: '26 Agt 2026'
  },
  {
    id: 'FAS-004',
    nama: 'Perpustakaan & Pojok Literasi',
    lokasi: 'Gedung C Lantai 1',
    kondisi: 'Baik',
    kondisiBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    jumlahTotal: 1200,
    jumlahBaik: 1150,
    jumlahRusak: 50,
    keterangan: 'Koleksi buku Kurikulum Merdeka lengkap, ruang baca ber-AC.',
    kebutuhanTambahan: '3 unit E-Reader Tablet & 200 Judul Buku Fiksi Edukasi',
    terakhirCek: '22 Agt 2026'
  }
];

export const initialVerifications = [
  {
    id: 'VRF-001',
    tipe: 'guru',
    judul: 'Pengadaan Laptop Lab IPA & TIK (15 Unit)',
    kategori: 'Peralatan IT & Digital',
    pemohon: 'Budi Santoso, S.Kom',
    peranPemohon: 'Kepala Lab Komputer',
    tanggal: '28 Agt 2026',
    urgensi: 'Mendesak',
    urgensiBadge: 'bg-red-50 text-red-700 border-red-200',
    estimasiBiaya: 'Rp 105.000.000',
    justifikasi: 'Persiapan pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) dan pembelajaran coding siswa.',
    status: 'menunggu', // 'menunggu' | 'disetujui_sekolah' | 'diteruskan_pemda' | 'disetujui_pemda' | 'ditolak' | 'perlu_revisi'
    statusLabel: 'Menunggu Verifikasi',
    catatanAdmin: '',
    lampiran: 'Proposal_ANBK_2026.pdf (1.2 MB)',
    buktiUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'VRF-002',
    tipe: 'guru',
    judul: 'Pembaruan Server & Data Dapodik Semester 1',
    kategori: 'Administrasi Data',
    pemohon: 'Siti Rahmawati',
    peranPemohon: 'Staf Tata Usaha',
    tanggal: '27 Agt 2026',
    urgensi: 'Mendesak',
    urgensiBadge: 'bg-red-50 text-red-700 border-red-200',
    estimasiBiaya: 'Rp 8.500.000',
    justifikasi: 'Peremajaan SSD server backup dan integrasi API data bantuan sosial siswa.',
    status: 'disetujui_sekolah',
    statusLabel: 'Disetujui Sekolah',
    catatanAdmin: 'Disetujui oleh Kepala Sekolah. Diteruskan ke anggaran BOS Reguler.',
    lampiran: 'Rincian_Teknis_Server.pdf (450 KB)',
    buktiUrl: null
  },
  {
    id: 'VRF-003',
    tipe: 'guru',
    judul: 'Perbaikan Plafon & Atap Ruang Kelas 7B',
    kategori: 'Pemeliharaan Sarpras',
    pemohon: 'Ahmad Fauzi',
    peranPemohon: 'Koordinator Sarpras',
    tanggal: '26 Agt 2026',
    urgensi: 'Mendesak',
    urgensiBadge: 'bg-red-50 text-red-700 border-red-200',
    estimasiBiaya: 'Rp 14.200.000',
    justifikasi: 'Plafon retak berisiko membahayakan 36 siswa saat kegiatan belajar mengajar berlangsung.',
    status: 'diteruskan_pemda',
    statusLabel: 'Diteruskan ke Pemerintah',
    catatanAdmin: 'Diteruskan ke Dinas Pendidikan DKI Jakarta melalui program DAK Fisik.',
    lampiran: 'Foto_Kerusakan_Plafon.jpg (3.8 MB)',
    buktiUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'VRF-004',
    tipe: 'guru',
    judul: 'Pelatihan Kurikulum Merdeka Guru Mapel Sains',
    kategori: 'Pelatihan Guru',
    pemohon: 'Dewi Lestari, M.Pd.',
    peranPemohon: 'Wali Kelas 8B & Tim Kurikulum',
    tanggal: '24 Agt 2026',
    urgensi: 'Sedang',
    urgensiBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    estimasiBiaya: 'Rp 4.000.000',
    justifikasi: 'Workshop pembuatan modul ajar digital berbasis STEM interaktif untuk 6 guru IPA & Matematika.',
    status: 'menunggu',
    statusLabel: 'Menunggu Verifikasi',
    catatanAdmin: '',
    lampiran: 'Silabus_Pelatihan_STEM.pdf (820 KB)'
  },
  {
    id: 'VRF-005',
    tipe: 'siswa',
    judul: 'Bantuan Perlengkapan Seragam & Sepatu Sekolah Siswa Afirmasi',
    kategori: 'Bantuan Siswa & KIP',
    pemohon: 'Rian Pratama (Siswa Kelas 7A)',
    peranPemohon: 'Siswa Afirmasi Prasejahtera',
    tanggal: '29 Agt 2026',
    urgensi: 'Mendesak',
    urgensiBadge: 'bg-red-50 text-red-700 border-red-200',
    estimasiBiaya: 'Rp 650.000',
    justifikasi: 'Sepatu siswa robek dan belum memiliki seragam olahraga serta batik resmi sekolah karena kendala ekonomi keluarga.',
    status: 'menunggu',
    statusLabel: 'Menunggu Verifikasi',
    catatanAdmin: '',
    lampiran: 'Surat_Keterangan_Tidak_Mampu.pdf (620 KB)'
  },
  {
    id: 'VRF-006',
    tipe: 'siswa',
    judul: 'Pengadaan Kacamata Koreksi Minus Siswa Penerima KIP',
    kategori: 'Bantuan Siswa & KIP',
    pemohon: 'Aisyah Putri Azzahra (Siswa Kelas 8A)',
    peranPemohon: 'Siswa Penerima KJP Plus',
    tanggal: '28 Agt 2026',
    urgensi: 'Sedang',
    urgensiBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    estimasiBiaya: 'Rp 450.000',
    justifikasi: 'Siswa mengalami kesulitan membaca papan tulis dan layar pembelajaran, membutuhkan kacamata silindris minus.',
    status: 'disetujui_sekolah',
    statusLabel: 'Disetujui Sekolah',
    catatanAdmin: 'Disetujui dialokasikan melalui program kepedulian sosial dana komite sekolah.',
    lampiran: 'Hasil_Pemeriksaan_Mata_Puskesmas.pdf (310 KB)'
  },
  {
    id: 'VRF-007',
    tipe: 'siswa',
    judul: 'Bantuan Peminjaman Tablet Pembelajaran Mandiri Siswa 3T',
    kategori: 'Bantuan Siswa & KIP',
    pemohon: 'Clarissa Maharani (Siswa Kelas 7B)',
    peranPemohon: 'Siswa Penerima KIP',
    tanggal: '25 Agt 2026',
    urgensi: 'Sedang',
    urgensiBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    estimasiBiaya: 'Rp 1.800.000',
    justifikasi: 'Peminjaman tablet dari perpustakaan sekolah untuk mengerjakan modul literasi dan asesmen harian di rumah.',
    status: 'diteruskan_pemda',
    statusLabel: 'Diteruskan ke Pemerintah',
    catatanAdmin: 'Diusulkan masuk kuota bantuan perangkat siswa Program Indonesia Pintar (PIP) Dinas.',
    lampiran: 'Formulir_Pengajuan_Tablet_Siswa.pdf (410 KB)'
  }
];

export const initialAssistanceShipments = [
  {
    id: 'SHP-001',
    program: 'Program Digitalisasi Sekolah Kemendikbudristek 2026',
    sumberDana: 'DAK Fisik Kemendikbudristek 2026',
    tahap: 'Disalurkan',
    tahapIndex: 4, // 1: Diajukan, 2: Diverifikasi, 3: Disetujui, 4: Disalurkan, 5: Diterima
    jumlahItem: '20 Unit Chromebook & 1 Router Mesh',
    ekspedisi: 'PT Pos Logistik Indonesia (Resi: KEMDIK-LOG-8829104)',
    statusKondisi: 'Dalam Pengiriman Menuju SMP Negeri 1 Merata',
    tanggalKirim: '25 Agt 2026',
    estimasiTiba: '31 Agt 2026',
    penerima: 'Ahmad Fauzi (Sarpras)'
  },
  {
    id: 'SHP-002',
    program: 'Bantuan Operasional Sekolah Kinerja (BOS Kinerja)',
    sumberDana: 'Dinas Pendidikan Provinsi DKI Jakarta',
    tahap: 'Diterima',
    tahapIndex: 5,
    jumlahItem: 'Dana Transfer Bank (Rp 65.000.000)',
    ekspedisi: 'Bank DKI Virtual Account (Resi: SP2D-DKI-2026-0912)',
    statusKondisi: 'Tercairkan & Terverifikasi di Rekening Sekolah',
    tanggalKirim: '10 Agt 2026',
    estimasiTiba: '12 Agt 2026',
    penerima: 'Dra. Hj. Sri Wahyuni, M.Pd. (Kepsek)'
  },
  {
    id: 'SHP-003',
    program: 'Bantuan Penggantian Buku Teks Kurikulum Merdeka Fase D',
    sumberDana: 'Pusat Kurikulum dan Perbukuan (Puskurjar)',
    tahap: 'Disetujui',
    tahapIndex: 3,
    jumlahItem: '450 Eksemplar Buku Teks',
    ekspedisi: 'Balai Pustaka Ekspedisi (Resi: PUSKUR-BOK-2026-44)',
    statusKondisi: 'Sedang Proses Pengepakan Gudang',
    tanggalKirim: 'Menunggu Jadwal Distribusi',
    estimasiTiba: '08 Sep 2026',
    penerima: 'Ratna Sari, S.Pd. (Perpustakaan)'
  }
];

export const bantuanStages = [
  { id: 1, name: 'Diajukan', count: 120, status: 'completed', icon: FileText },
  { id: 2, name: 'Diverifikasi', count: 85, status: 'completed', icon: FileCheck2 },
  { id: 3, name: 'Disetujui', count: 45, status: 'current', icon: Check },
  { id: 4, name: 'Disalurkan', count: 12, status: 'upcoming', icon: Send },
  { id: 5, name: 'Diterima', count: 103, status: 'upcoming', icon: PackageCheck },
];

export const attentionList = [
  {
    id: 1,
    name: 'Rian Pratama',
    role: 'Siswa - Kelas 8B',
    initials: 'RP',
    initialsBg: 'bg-rose-100 text-rose-700',
    warning: 'Absen berturut-turut 4 hari tanpa keterangan',
    urgency: 'Tinggi',
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    role: 'Siswa - Kelas 9A',
    initials: 'SN',
    initialsBg: 'bg-amber-100 text-amber-700',
    warning: 'Dokumen bantuan KIP belum terverifikasi',
    urgency: 'Sedang',
  },
  {
    id: 3,
    name: 'Drs. Bambang S.',
    role: 'Guru - Fisika',
    initials: 'BS',
    initialsBg: 'bg-purple-100 text-purple-700',
    warning: 'Nilai rapor semester genap belum diserahkan',
    urgency: 'Sedang',
  },
];

export const schoolNeedsSummary = [
  {
    id: 1,
    name: 'Pemeliharaan Fasilitas',
    percentage: 75,
    budgetSpent: 'Rp 45.000.000 / Rp 60.000.000',
    color: 'bg-blue-600',
    barBg: 'bg-blue-100',
    status: 'Terkendali',
    statusBadge: 'text-blue-700 bg-blue-50 border-blue-200',
    isUrgent: false,
  },
  {
    id: 2,
    name: 'Peralatan IT',
    percentage: 40,
    budgetSpent: 'Rp 20.000.000 / Rp 50.000.000',
    color: 'bg-rose-500',
    barBg: 'bg-rose-100',
    status: 'Mendesak (40%)',
    statusBadge: 'text-rose-700 bg-rose-50 border-rose-200',
    isUrgent: true,
  },
  {
    id: 3,
    name: 'Penggantian Buku Teks',
    percentage: 20,
    budgetSpent: 'Rp 6.000.000 / Rp 30.000.000',
    color: 'bg-amber-500',
    barBg: 'bg-amber-100',
    status: 'Dalam Proses',
    statusBadge: 'text-amber-700 bg-amber-50 border-amber-200',
    isUrgent: false,
  },
];
