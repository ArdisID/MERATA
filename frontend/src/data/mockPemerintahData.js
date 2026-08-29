export const mockPemerintahProfile = {
  nama: 'Dr. H. Bambang Soeprapto, M.Ed.',
  nip: '196908121994031002',
  instansi: 'Dinas Pendidikan Provinsi DKI Jakarta',
  jabatan: 'Kepala Bidang Pembinaan SMP & Fasilitasi Mutu Pendidikan',
  wilayahKerja: 'Provinsi DKI Jakarta',
  email: 'bambang.soeprapto@disdik.jakarta.go.id',
  telepon: '(021) 395-8821',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
};

export const mockPemerintahStats = {
  totalSekolah: 248,
  totalSiswa: 84200,
  totalGuru: 5420,
  sekolahPrioritas: 34,
  totalAnggaranTersedia: 'Rp 45.000.000.000',
  anggaranTerealisasi: 'Rp 31.850.000.000 (70.7%)',
  bantuanTersalurkan: 182,
};

export const mockSchoolListPemerintah = [
  {
    id: 'SCH-01',
    nama: 'SMP Negeri 1 Merata',
    npsn: '20108942',
    wilayah: 'Jakarta Selatan',
    akreditasi: 'A',
    totalSiswa: 1248,
    totalGuru: 84,
    totalKelas: 32,
    kondisiFasilitas: '82% Baik (1 Ruang & 15 PC Rusak)',
    statusPrioritas: 'Prioritas Sedang',
    prioritasBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    usulanTerbaru: 'Pengadaan 15 Unit Laptop Lab ANBK & Perbaikan Atap Kelas 7B',
    nilaiBantuanDiminta: 'Rp 119.200.000',
    statusApproval: 'Menunggu Persetujuan Dinas'
  },
  {
    id: 'SCH-02',
    nama: 'SMP Negeri 45 Pulau Seribu',
    npsn: '20109881',
    wilayah: 'Kepulauan Seribu',
    akreditasi: 'B',
    totalSiswa: 340,
    totalGuru: 24,
    totalKelas: 12,
    kondisiFasilitas: '55% Baik (Krisis Akses Internet & Lab)',
    statusPrioritas: 'Prioritas Tertinggi (3T)',
    prioritasBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    usulanTerbaru: 'Pemasangan Internet Satelit Starlink & 30 Unit Chromebook',
    nilaiBantuanDiminta: 'Rp 180.000.000',
    statusApproval: 'Disetujui Dinas (Proses Lelang)'
  },
  {
    id: 'SCH-03',
    nama: 'SD Negeri Merata 03',
    npsn: '20105521',
    wilayah: 'Jakarta Timur',
    akreditasi: 'A',
    totalSiswa: 680,
    totalGuru: 38,
    totalKelas: 18,
    kondisiFasilitas: '90% Baik',
    statusPrioritas: 'Reguler',
    prioritasBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    usulanTerbaru: 'Buku Teks Kurikulum Merdeka Fase B & C',
    nilaiBantuanDiminta: 'Rp 28.000.000',
    statusApproval: 'Tersalurkan'
  }
];

export const mockPemerintahReports = [
  {
    id: 'REP-01',
    namaLaporan: 'Laporan Rekapitulasi Kondisi Sarpras Sekolah 2026',
    kategori: 'Sarana & Prasarana',
    periode: 'Semester Genap 2025/2026',
    format: 'PDF & Excel',
    ukuran: '4.2 MB',
    tanggal: '28 Agt 2026'
  },
  {
    id: 'REP-02',
    namaLaporan: 'Statistik Pemerataan & Distribusi Bantuan Pendidikan Wilayah',
    kategori: 'Alokasi Bantuan & BOS',
    periode: 'Tahap 1 & 2 Tahun 2026',
    format: 'PDF & Excel',
    ukuran: '6.8 MB',
    tanggal: '26 Agt 2026'
  },
  {
    id: 'REP-03',
    namaLaporan: 'Pemetaan Siswa Penerima KIP/KJP & Kebutuhan Khusus',
    kategori: 'Kesejahteraan Siswa',
    periode: 'Tahun Ajaran 2026/2027',
    format: 'Excel',
    ukuran: '8.1 MB',
    tanggal: '20 Agt 2026'
  }
];

export const initialCurriculumMaterials = [
  {
    id: 'MAT-001',
    jenjang: 'SD / Fase C',
    kelas: 'Kelas 5 SD',
    mapel: 'Matematika',
    topik: 'Pecahan (Fractions)',
    jumlahSubmateri: 5,
    author: 'Puskurjar Kemendikbudristek & Tim Pengembang DKI',
    tanggalTerbit: '15 Agt 2026',
    status: 'Terdistribusi Nasional',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    deskripsi: 'Memahami konsep dasar bagian dari keseluruhan, operasi hitung pecahan biasa, campuran, desimal, dan aplikasinya.'
  },
  {
    id: 'MAT-002',
    jenjang: 'SMP / Fase D',
    kelas: 'Kelas 7 SMP',
    mapel: 'Informatika & TIK',
    topik: 'Berpikir Komputasional & Algoritma Blok',
    jumlahSubmateri: 4,
    author: 'Direktorat SMP Kemendikbudristek',
    tanggalTerbit: '20 Agt 2026',
    status: 'Terdistribusi Nasional',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    deskripsi: 'Pengenalan pola algoritma, dekomposisi masalah, dan implementasi coding visual Scratch.'
  },
  {
    id: 'MAT-003',
    jenjang: 'SMP / Fase D',
    kelas: 'Kelas 8 SMP',
    mapel: 'Matematika',
    topik: 'Aljabar & Persamaan Linear Satu Variabel',
    jumlahSubmateri: 4,
    author: 'Balai Guru Penggerak DKI Jakarta',
    tanggalTerbit: '22 Agt 2026',
    status: 'Terdistribusi Nasional',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    deskripsi: 'Konsep variabel, koefisien, konstanta, dan penyelesaian masalah kontekstual persamaan aljabar.'
  }
];
