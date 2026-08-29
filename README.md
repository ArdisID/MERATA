# 📚 MERATA (Media Edukasi dan Pemerataan Pendidikan)

**MERATA** adalah platform digital terintegrasi yang menghubungkan **Guru**, **Administrasi Sekolah**, dan **Pemerintah (Dinas Pendidikan)** untuk mendukung kegiatan pembelajaran interaktif di kelas, memantau perkembangan siswa, mengelola fasilitas sarana prasarana sekolah, serta mengidentifikasi dan menyalurkan bantuan pendidikan secara merata dan tepat sasaran.

---

## 🌟 Fitur Utama Berdasarkan Peran

### 1. 🎓 Web Guru (`/guru`)
- **Dashboard Guru**: Ringkasan jadwal harian, rombel kelas aktif, presensi siswa rata-rata, dan status usulan kebutuhan.
- **Manajemen Kelas & Kurikulum**:
  - Pilihan rombel kelas (Kelas 5A, 7A, 8B).
  - Modul ajar terstruktur (Tujuan pembelajaran, materi konsep, ilustrasi visual, video pembelajaran, contoh soal terbimbing, slide presentasi interaktif, dan modul cetak PDF offline).
  - **Presensi Harian Siswa**: Pencatatan kehadiran harian (Hadir, Izin, Sakit, Alpa) dengan auto-sync ke rekam siswa.
- **4 Game Edukasi Gamifikasi**:
  1. *Matching Cards* (Pecahan & Desimal) dengan timer & move counter.
  2. *Urutkan Nilai Pecahan* (Ordering game dari nilai terkecil ke terbesar).
  3. *Puzzle Visual Pecahan* (Mencocokkan arsiran bangun datar dengan nilai pecahan).
  4. *Tebak Cepat Pecahan* (Speed math reflex game dengan streak counter & skor instan).
- **Quiz Evaluasi Interaktif**: Timer countdown, navigasi butir soal, pembahasan kunci jawaban, dan rekam skor instan ke database siswa.
- **Monitoring Perkembangan Siswa**: Daftar rekam nilai, persentase kehadiran, catatan guru, flag perhatian khusus, serta ekspor CSV & cetak laporan PDF.
- **Profil Guru & Pengajuan Kebutuhan**: Riwayat sertifikasi, poin kontribusi, form pengajuan sarpras/pelatihan, serta aksi edit dan hapus usulan.

---

### 2. 🏫 Web Administrasi Sekolah (`/admin`)
- **Dashboard Sekolah**: Metrik agregat siswa, guru, kelas, kehadiran, ringkasan realisasi anggaran BOS/RKAS, tracker 5 tahap bantuan, dan daftar siswa/guru yang perlu perhatian khusus.
- **Data Sekolah (Dapodik)**:
  - *Data Siswa*: Biodata, NISN, status bantuan (KIP/KJP), kehadiran, dan riwayat bantuan.
  - *Data Guru*: NIP, mapel, status kepegawaian (PNS/PPPK/Honorer), dan sertifikasi.
  - *Data Kelas*: Wali kelas, komposisi gender siswa, dan jadwal pelajaran mingguan.
  - *Fasilitas & Sarpras*: Kondisi ruangan/laboratorium, jumlah alat baik vs rusak, dan kebutuhan renovasi.
- **Kebutuhan & Bantuan**:
  - *Verifikasi Kebutuhan*: Alur disposisi persetujuan (Setujui RKAS, Teruskan ke Dinas, Minta Revisi Data, Tolak).
  - *Pelacakan Distribusi*: Tracking ekspedisi logistik dan konfirmasi penerimaan berita acara (BAST).
- **Profil Sekolah**: Legalitas identitas sekolah (NPSN, Akreditasi, Kontak resmi, Rekap operasional) dengan mode edit tersinkronisasi.

---

### 3. 🏛️ Web Pemerintah / Dinas Pendidikan (`/pemerintah`)
- **Dashboard Pengawasan Wilayah**: Ringkasan 248 sekolah se-provinsi, total murid & guru terdaftar, pemetaan sekolah prioritas sarpras rusak, dan realisasi anggaran DAK Fisik.
- **Monitoring Database Sekolah & Pendidikan**: Data komprehensif profil sekolah, data agregat seluruh siswa, guru, rombel kelas, dan kondisi sarana prasarana.
- **Bank Materi Kurikulum Nasional**: Pengelolaan dan penerbitan modul ajar baru yang otomatis terdistribusi ke akun seluruh guru.
- **Persetujuan & Alokasi Bantuan**: Evaluasi proposal sekolah, alokasi jenis bantuan (Barang, Fasilitas, Layanan, Dana), penolakan pengajuan, dan penerbitan nomor resi pengiriman logistik.
- **Laporan & Ekspor**: Ekspor rekapitulasi data sekolah ke CSV dan cetak PDF resmi ber-Kop Dinas Pendidikan.
- **Profil Dinas Pendidikan**: Identitas instansi pengawas dan rekapitulasi statistik wilayah kerja.

---

### ⚡ Fitur Spesial: Simulasi Mode Offline 3T
Platform dilengkapi simulasi jaringan area 3T (Tertinggal, Terdepan, Terluar) yang memungkinkan modul ajar, game edukasi, dan evaluasi tetap berjalan lancar menggunakan local cache / edge storage tanpa ketergantungan internet stabil.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan custom typography (Plus Jakarta Sans & Inter)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Synthesizer**: Zero-dependency Web Audio API sound generator (`audioUtils.js`)
- **Gamification Particle**: HTML5 Canvas confetti emitter (`confettiUtils.js`)
- **Export Utilities**: RFC 4180 CSV export & dynamic printable document generator (`exportUtils.js`)

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- NPM atau PNPM

### Instalasi & Menjalankan

1. **Clone repositori**:
   ```bash
   git clone https://github.com/username/MERATA.git
   cd MERATA/frontend
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Akses aplikasi di browser melalui: `http://localhost:5173`

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 📁 Struktur Direktori

```text
MERATA/
├── PRD.Md                        # Dokumen Product Requirement Document
├── README.md                     # Dokumentasi Proyek
└── frontend/
    ├── index.html                # Entry HTML dengan Google Fonts & SEO Meta
    ├── package.json              # Dependensi proyek
    ├── vite.config.js            # Konfigurasi Vite
    ├── tailwind.config.js        # Konfigurasi Tailwind CSS
    └── src/
        ├── App.jsx               # Root Component & State Lifecycle Orchestrator
        ├── main.jsx              # Application Entry Point
        ├── index.css             # Design Tokens, Animations & Glassmorphism
        ├── components/
        │   ├── auth/             # Login Portal dengan Role Switcher
        │   ├── guru/             # Komponen Web Guru (Dashboard, Kelas, Game, Quiz, Monitoring, Profil)
        │   ├── admin/            # Komponen Web Admin (Dashboard, DataSekolah, KebutuhanBantuan, Profil)
        │   ├── pemerintah/       # Komponen Web Pemerintah (Dashboard, Monitoring, BankMateri, Approval, Laporan, Profil)
        │   └── layout/           # Sidebar & Header responsif untuk Guru dan Admin
        ├── data/                 # Dataset Mock Terintegrasi (Guru, Admin, Pemerintah)
        └── utils/                # Audio Synthesizer, Confetti Canvas, Export CSV & Print PDF
```

---

## 📄 Lisensi
Hak Cipta © 2026 MERATA Team. Dikembangkan untuk kemajuan dan pemerataan pendidikan di seluruh penjuru Indonesia.
