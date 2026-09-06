/**
 * Data Adapters for MERATA Platform
 * Translates between Laravel Eloquent (snake_case) and React UI Components (camelCase)
 */

export const adaptSiswa = (s) => ({
  id: s.kode || `SIS-${String(s.id).padStart(3, '0')}`,
  dbId: s.id,
  nisn: s.nisn || '-',
  nama: s.nama,
  gender: s.gender || 'Laki-laki',
  kelas: s.kelas_nama || (s.kelas ? s.kelas.nama : '7A'),
  kehadiran: Number(s.kehadiran) || 0,
  statusKehadiran: s.status_kehadiran || 'Hadir Normal',
  nilaiRataRata: Number(s.nilai_rata_rata) || 0,
  statusBantuan: s.status_bantuan || 'Non-Penerima',
  bantuanBadge: s.bantuan_badge || 'bg-gray-50 text-gray-700 border-gray-200',
  kebutuhan: s.kebutuhan || '-',
  catatan: s.catatan || '',
  riwayatBantuan: Array.isArray(s.riwayat_bantuan) ? s.riwayat_bantuan : []
});

export const adaptGuru = (g) => ({
  id: g.kode || `GUR-${String(g.id).padStart(3, '0')}`,
  dbId: g.id,
  nip: g.nip || '-',
  nama: g.nama,
  gender: g.gender || 'Laki-laki',
  mapel: g.mapel || '-',
  kelasAjar: Array.isArray(g.kelas_ajar) ? g.kelas_ajar : [],
  jabatan: g.jabatan || 'Guru Mata Pelajaran',
  statusKepegawaian: g.status_kepegawaian || 'PNS',
  sertifikasi: g.sertifikasi || 'Sudah Sertifikasi',
  pendidikan: g.pendidikan || 'S1 Pendidikan',
  lamaMengajar: g.lama_mengajar || '5 Tahun',
  poinKontribusi: Number(g.poin_kontribusi) || 0,
  kebutuhan: g.kebutuhan || '-',
  telepon: g.telepon || '-',
  email: g.email || '-'
});

export const adaptKelas = (k) => ({
  id: k.kode || `KLS-${k.nama}`,
  dbId: k.id,
  tingkat: k.tingkat,
  nama: k.nama,
  ruang: k.ruang || `Gedung ${k.nama}`,
  waliKelas: k.wali_kelas || '-',
  totalSiswa: k.total_siswa || (k.siswas ? k.siswas.length : 36),
  lakiLaki: k.laki_laki || 18,
  perempuan: k.perempuan || 18,
  kehadiranRata: k.kehadiran_rata || '95.0%',
  status: k.status || 'Aktif',
  jadwal: Array.isArray(k.jadwals) ? k.jadwals.map(j => ({
    hari: j.hari,
    jam: j.jam,
    mapel: j.mapel,
    guru: j.guru
  })) : []
});

export const adaptFasilitas = (f) => ({
  id: f.kode || `FAS-${String(f.id).padStart(3, '0')}`,
  dbId: f.id,
  nama: f.nama,
  lokasi: f.lokasi,
  kondisi: f.kondisi,
  kondisiBadge: f.kondisi_badge || (f.kondisi === 'Baik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'),
  jumlahTotal: f.jumlah_total || 0,
  jumlahBaik: f.jumlah_baik || 0,
  jumlahRusak: f.jumlah_rusak || 0,
  keterangan: f.keterangan || '',
  kebutuhanTambahan: f.kebutuhan_tambahan || '',
  terakhirCek: f.terakhir_cek || '-'
});

export const adaptVerifikasi = (v) => ({
  id: v.kode || `VRF-${String(v.id).padStart(3, '0')}`,
  dbId: v.id,
  judul: v.judul,
  kategori: v.kategori,
  pemohon: v.pemohon || 'Guru',
  peranPemohon: v.peran_pemohon || 'Guru Mata Pelajaran',
  tanggal: v.tanggal || 'Hari ini',
  urgensi: v.urgensi || 'Sedang',
  urgensiBadge: v.urgensi_badge || 'bg-amber-50 text-amber-700 border-amber-200',
  estimasiBiaya: v.estimasi_biaya || v.biaya || 'Rp 0',
  justifikasi: v.justifikasi || v.keterangan || '',
  status: v.status || 'menunggu',
  statusLabel: v.status_label || 'Menunggu Verifikasi',
  catatanAdmin: v.catatan_admin || '',
  lampiran: v.lampiran || ''
});

export const adaptTeacherNeed = (tn) => {
  let badge = 'bg-amber-50 text-amber-700 border-amber-200';
  if (tn.status === 'disetujui_sekolah' || tn.status === 'disetujui_pemda') {
    badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (tn.status === 'ditolak') {
    badge = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return {
    id: tn.kode || `GUR-NEED-${String(tn.id).padStart(3, '0')}`,
    dbId: tn.id,
    judul: tn.judul,
    kategori: tn.kategori,
    tanggal: tn.tanggal || 'Hari ini',
    status: tn.status_label || tn.status || 'Menunggu Verifikasi Sekolah',
    badge: badge,
    estimasi: tn.estimasi_biaya || tn.biaya || 'Rp 0',
    keterangan: tn.justifikasi || tn.keterangan || ''
  };
};

export const adaptShipment = (s) => ({
  id: s.kode || `LOG-${String(s.id).padStart(3, '0')}`,
  dbId: s.id,
  program: s.program,
  sumberDana: s.sumber_dana || 'DAK Fisik Kemendikbudristek 2026',
  tahap: s.tahap || 'Disalurkan',
  tahapIndex: s.tahap_index ?? 4,
  jumlahItem: s.jumlah_item,
  ekspedisi: s.ekspedisi || 'PT Pos Logistik Indonesia',
  statusKondisi: s.status_kondisi || 'Dalam Pengiriman',
  tanggalKirim: s.tanggal_kirim || 'Hari ini',
  estimasiTiba: s.estimasi_tiba || '2-3 Hari Kerja',
  penerima: s.penerima || 'Admin Sekolah'
});

export const adaptSchoolProfile = (sp, fallback) => {
  if (!sp) return fallback;
  return {
    nama: sp.nama || fallback.nama,
    npsn: sp.npsn || fallback.npsn,
    akreditasi: sp.akreditasi || fallback.akreditasi,
    statusSekolah: sp.status_sekolah || fallback.statusSekolah,
    jenjang: sp.jenjang || fallback.jenjang,
    kepalaSekolah: sp.kepala_sekolah || fallback.kepalaSekolah,
    nipKepsek: sp.nip_kepsek || fallback.nipKepsek,
    operator: sp.operator || fallback.operator,
    alamat: sp.alamat || fallback.alamat,
    wilayah: sp.wilayah || fallback.wilayah,
    kodePos: sp.kode_pos || fallback.kodePos,
    telepon: sp.telepon || fallback.telepon,
    email: sp.email || fallback.email,
    website: sp.website || fallback.website,
    kurikulum: sp.kurikulum || fallback.kurikulum,
    stats: {
      totalSiswa: sp.total_siswa || fallback.stats.totalSiswa,
      trendSiswa: fallback.stats.trendSiswa,
      totalGuru: sp.total_guru || fallback.stats.totalGuru,
      trendGuru: fallback.stats.trendGuru,
      totalKelas: sp.total_kelas || fallback.stats.totalKelas,
      trendKelas: fallback.stats.trendKelas,
      tingkatKehadiran: sp.tingkat_kehadiran || fallback.stats.tingkatKehadiran,
      trendKehadiran: fallback.stats.trendKehadiran,
      labKomputer: fallback.stats.labKomputer,
      labIPA: fallback.stats.labIPA
    }
  };
};
