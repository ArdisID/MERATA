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
  {
    id: 'SIS-001',
    nisn: '0089123411',
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
    id: 'SIS-002',
    nisn: '0089123412',
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
    id: 'SIS-003',
    nisn: '0089123413',
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
    id: 'SIS-004',
    nisn: '0089123414',
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
    id: 'SIS-005',
    nisn: '0089123415',
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
    id: 'SIS-006',
    nisn: '0089123416',
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
    judul: 'Pengadaan Laptop Lab IPA & TIK (15 Unit)',
    kategori: 'Peralatan IT & Digital',
    pemohon: 'Budi Santoso, S.Kom',
    peranPemohon: 'Kepala Lab Komputer',
    tanggal: '28 Agt 2026',
    urgensi: 'Mendesak',
    urgensiBadge: 'bg-red-50 text-red-700 border-red-200',
    estimasiBiaya: 'Rp 105.000.000',
    justifikasi: 'Persiapan pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) dan pembelajaran coding siswa.',
    status: 'menunggu', // 'menunggu' | 'disetujui_sekolah' | 'diteruskan_pemda' | 'ditolak' | 'revisi'
    statusLabel: 'Menunggu Verifikasi',
    catatanAdmin: '',
    lampiran: 'Proposal_ANBK_2026.pdf (1.2 MB)'
  },
  {
    id: 'VRF-002',
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
    lampiran: 'Rincian_Teknis_Server.pdf (450 KB)'
  },
  {
    id: 'VRF-003',
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
    lampiran: 'Foto_Kerusakan_Plafon.pdf (3.8 MB)'
  },
  {
    id: 'VRF-004',
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
