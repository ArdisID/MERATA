/**
 * Data Adapters for MERATA Platform
 * Translates between Laravel Eloquent (snake_case) and React UI Components (camelCase)
 */

export const adaptSiswa = (s) => ({
  id: s.kode || `SIS-${String(s.id).padStart(3, '0')}`,
  dbId: s.id,
  sekolahId: s.sekolah_id,
  sekolah_id: s.sekolah_id,
  nisn: s.nisn || '-',
  nama: s.nama,
  gender: s.gender || 'Laki-laki',
  kelas: s.kelas_nama || (s.kelas ? (typeof s.kelas === 'object' ? s.kelas.nama : s.kelas) : '-'),
  kehadiran: Number(s.kehadiran) || 0,
  statusKehadiran: s.status_kehadiran || 'Hadir Normal',
  nilaiRataRata: Number(s.nilai_rata_rata) || 0,
  statusBantuan: s.status_bantuan || 'Non-Penerima',
  bantuanBadge: s.bantuan_badge || 'bg-gray-50 text-gray-700 border-gray-200',
  kebutuhan: s.kebutuhan || '-',
  catatan: s.catatan || '',
  asalSekolah: s.sekolah?.nama || s.asal_sekolah || s.asalSekolah || 'Satuan Pendidikan Wilayah',
  riwayatBantuan: Array.isArray(s.riwayat_bantuan) ? s.riwayat_bantuan : []
});

export const adaptMateri = (m) => ({
  id: m.kode || `MAT-${m.id}`,
  dbId: m.id,
  kode: m.kode,
  jenjang: m.jenjang || '',
  kelas: m.kelas || '',
  mapel: m.mapel || '',
  topik: m.topik || '',
  topikUtama: m.topik || '',
  jumlahSubmateri: m.jumlah_submateri || (Array.isArray(m.submateris) ? m.submateris.length : 0),
  author: m.author || 'Kemendikbudristek',
  tanggalTerbit: m.tanggal_terbit || 'Agt 2026',
  status: m.status || 'Terdistribusi',
  badge: m.badge || 'bg-emerald-50 text-emerald-700 border-emerald-200',
  deskripsi: m.deskripsi || '',
  submateri: Array.isArray(m.submateris) && m.submateris.length > 0 ? m.submateris.map((sub, idx) => ({
    id: sub.id ? `sub-${sub.id}` : `sub-${idx + 1}`,
    nomor: sub.nomor || (idx + 1),
    judul: sub.judul || `Submateri ${idx + 1}`,
    durasi: sub.durasi || '2 JP (70 Menit)',
    tujuan: Array.isArray(sub.tujuan) ? sub.tujuan : [sub.judul || 'Pemahaman materi'],
    materiUtama: sub.materi_utama || sub.materiUtama || '',
    video: sub.video || null,
    contohSoal: Array.isArray(sub.contoh_soal) ? sub.contoh_soal : (Array.isArray(sub.contohSoal) ? sub.contohSoal : []),
    slides: Array.isArray(sub.slides) ? sub.slides : []
  })) : (Array.isArray(m.submateri) ? m.submateri : []),
  quizzes: Array.isArray(m.quizzes) ? m.quizzes : [],
  gameDatasets: Array.isArray(m.game_datasets || m.gameDatasets) ? (m.game_datasets || m.gameDatasets) : []
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

export const getStorageUrl = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.startsWith('/') ? url : `/${url}`;
  return `http://127.0.0.1:8000${clean}`;
};

export const adaptVerifikasi = (v) => {
  const rawUrl = v.bukti_url || v.buktiUrl || v.lampiran_url || v.lampiranUrl || null;
  const storageUrl = getStorageUrl(rawUrl);

  return {
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
    lampiran: v.lampiran || '',
    buktiUrl: storageUrl,
    lampiranUrl: storageUrl
  };
};

export const adaptTeacherNeed = (tn) => {
  let badge = 'bg-amber-50 text-amber-700 border-amber-200';
  if (tn.status === 'disetujui_sekolah' || tn.status === 'disetujui_pemda') {
    badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (tn.status === 'ditolak') {
    badge = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  const rawUrl = tn.bukti_url || tn.buktiUrl || tn.lampiran_url || tn.lampiranUrl || null;
  const storageUrl = getStorageUrl(rawUrl);

  return {
    id: tn.kode || `GUR-NEED-${String(tn.id).padStart(3, '0')}`,
    dbId: tn.id,
    judul: tn.judul,
    kategori: tn.kategori,
    tanggal: tn.tanggal || 'Hari ini',
    status: tn.status_label || tn.status || 'Menunggu Verifikasi Sekolah',
    badge: badge,
    estimasi: tn.estimasi_biaya || tn.biaya || 'Rp 0',
    keterangan: tn.justifikasi || tn.keterangan || '',
    lampiran: tn.lampiran || '',
    buktiUrl: storageUrl,
    lampiranUrl: storageUrl
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

export const adaptSchoolProfile = (sp, fallback = {}) => {
  if (!sp) return fallback;
  const fbStats = fallback?.stats || {};
  return {
    id: sp.id || fallback.id || null,
    nama: sp.nama || fallback.nama || '',
    npsn: sp.npsn || fallback.npsn || '',
    akreditasi: sp.akreditasi || fallback.akreditasi || 'A',
    statusSekolah: sp.status_sekolah || fallback.statusSekolah || 'Negeri',
    jenjang: sp.jenjang || fallback.jenjang || 'SMP',
    kepalaSekolah: sp.kepala_sekolah || fallback.kepalaSekolah || '',
    nipKepsek: sp.nip_kepsek || fallback.nipKepsek || '',
    operator: sp.operator || fallback.operator || '',
    alamat: sp.alamat || fallback.alamat || '',
    wilayah: sp.wilayah || fallback.wilayah || '',
    kodePos: sp.kode_pos || fallback.kodePos || '',
    telepon: sp.telepon || fallback.telepon || '',
    email: sp.email || fallback.email || '',
    website: sp.website || fallback.website || '',
    kurikulum: sp.kurikulum || fallback.kurikulum || 'Kurikulum Merdeka',
    foto: sp.foto || fallback?.foto || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
    stats: {
      totalSiswa: sp.total_siswa ?? fbStats.totalSiswa ?? 0,
      trendSiswa: sp.trend_siswa || fbStats.trendSiswa || 'Stabil',
      totalGuru: sp.total_guru ?? fbStats.totalGuru ?? 0,
      trendGuru: sp.trend_guru || fbStats.trendGuru || 'Stabil',
      totalKelas: sp.total_kelas ?? fbStats.totalKelas ?? 0,
      trendKelas: sp.trend_kelas || fbStats.trendKelas || 'Stabil',
      tingkatKehadiran: sp.tingkat_kehadiran || fbStats.tingkatKehadiran || '100%',
      trendKehadiran: sp.trend_kehadiran || fbStats.trendKehadiran || 'Stabil',
      labKomputer: sp.lab_komputer ?? fbStats.labKomputer ?? 1,
      labIPA: sp.lab_ipa ?? fbStats.labIPA ?? 1
    }
  };
};

export const adaptSekolah = (sch) => ({
  id: sch.id,
  npsn: sch.npsn || '20101111',
  nama: sch.nama,
  wilayah: sch.wilayah || 'DKI Jakarta',
  akreditasi: sch.akreditasi || 'A',
  totalSiswa: sch.total_siswa || (sch.siswas ? sch.siswas.length : 0),
  totalGuru: sch.total_guru || (sch.gurus ? sch.gurus.length : 0),
  kondisiFasilitas: sch.kondisi_fasilitas || sch.status_fasilitas || 'Baik',
  statusPrioritas: sch.status_prioritas || (sch.kondisi_fasilitas === 'Rusak Berat' ? 'Prioritas 1 (Kritis)' : 'Standar'),
  usulanTerbaru: sch.usulan_terbaru || 'Pengajuan Perangkat TIK & Sanitasi',
  foto: sch.foto || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
  admin: sch.admin ? {
    id: sch.admin.id,
    name: sch.admin.name,
    email: sch.admin.email
  } : (sch.admin_account ? {
    id: sch.admin_account.id,
    name: sch.admin_account.name,
    email: sch.admin_account.email
  } : null)
});
