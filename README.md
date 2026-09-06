# 📚 MERATA (Media Edukasi dan Pemerataan Pendidikan)

**MERATA** adalah platform digital *full-stack* modern yang mengintegrasikan tiga pilar utama ekosistem pendidikan: **Guru**, **Administrasi Sekolah**, dan **Pemerintah (Dinas Pendidikan)**. Platform ini dirancang untuk mewujudkan pembelajaran interaktif, monitoring capaian siswa secara terpusat, tata kelola sarana-prasarana sekolah transparan, serta penyaluran bantuan pendidikan yang tepat sasaran dan akuntabel.

---

## 🏗️ Arsitektur Sistem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite 5)                    │
│                                                                        │
│   ┌────────────────┐     ┌────────────────┐     ┌──────────────────┐   │
│   │ 🎓 Web Guru    │     │ 🏫 Web Admin   │     │ 🏛️ Web Pemerintah│   │
│   │  (Jadwal, Modul│     │  (Dapodik CRUD,│     │  (Monitoring Wil,│   │
│   │   Game, Quiz,  │     │   Sarpras, BAST│     │   Bank Materi,   │   │
│   │   Presensi)    │     │   Verifikasi)  │     │   Disposisi)     │   │
│   └───────┬────────┘     └───────┬────────┘     └────────┬─────────┘   │
│           │                      │                       │             │
│           └──────────────────────┼───────────────────────┘             │
│                                  │                                     │
│                        [ API Client + Token Auth ]                     │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │ HTTPS / REST (JSON + Multipart)
┌──────────────────────────────────┴─────────────────────────────────────┐
│                    BACKEND (Laravel 12 RESTful API)                    │
│                                                                        │
│  ┌─────────────────────────┐     ┌──────────────────────────────────┐  │
│  │ Laravel Sanctum Tokens  │     │ Controllers (Auth, Guru, Admin,  │  │
│  │ CORS & Middleware Auth  │     │ Pemerintah, Upload, Kebutuhan)   │  │
│  └─────────────────────────┘     └─────────────────┬────────────────┘  │
│                                                    │ Eloquent ORM      │
│  ┌─────────────────────────┐     ┌─────────────────┴────────────────┐  │
│  │ Local Public Storage    │     │ Database (SQLite / MySQL)        │  │
│  │ (Avatar, Foto Sarpras)  │     │ Migrations & Realistic Seeders   │  │
│  └─────────────────────────┘     └──────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Fitur Utama Berdasarkan Peran

### 1. 🎓 Web Guru (`/guru`)
- **Dashboard Guru**: Ringkasan jadwal harian, rombel aktif, rata-rata kehadiran, dan status usulan kebutuhan.
- **Manajemen Kelas & Kurikulum**:
  - Pilihan rombel kelas (Kelas 5A, 7A, 8B).
  - Modul ajar terstruktur (Tujuan pembelajaran, konsep materi, ilustrasi visual, video pembelajaran, contoh soal terbimbing, slide presentasi, dan modul cetak PDF).
  - **Presensi Harian Terintegrasi**: Pencatatan kehadiran harian siswa (Hadir, Izin, Sakit, Alpa) dengan auto-sync ke database backend (`POST /api/guru/kelas/{id}/presensi`).
- **4 Game Edukasi Gamifikasi**:
  1. *Matching Cards* (Pecahan & Desimal) dengan timer & move counter.
  2. *Urutkan Nilai Pecahan* (Ordering game dari nilai terkecil ke terbesar).
  3. *Puzzle Visual Pecahan* (Mencocokkan arsiran bangun datar dengan nilai pecahan).
  4. *Tebak Cepat Pecahan* (Speed math reflex game dengan streak counter & skor instan).
- **Quiz Evaluasi Interaktif**:
  - Timer countdown & navigasi butir soal.
  - Pembahasan kunci jawaban interaktif & audio sound effect.
  - **Sinkronisasi Skor Realtime**: Nilai evaluasi siswa otomatis direkam ke kartu rekam dan database backend (`PUT /api/guru/siswa/{id}`).
- **Monitoring Perkembangan Siswa**: Daftar rekam nilai, persentase kehadiran, catatan guru, flag perhatian khusus, serta ekspor CSV & cetak PDF.
- **Profil Guru & Pengajuan Kebutuhan**:
  - Upload avatar profil via multipart storage API.
  - Form pengajuan sarpras/pelatihan baru (`POST /api/guru/kebutuhan`) yang langsung masuk ke antrean verifikasi Admin Sekolah.

---

### 2. 🏫 Web Administrasi Sekolah (`/admin`)
- **Dashboard Sekolah**: Metrik agregat siswa, guru, kelas, kehadiran, realisasi anggaran BOS/RKAS, tracker 5 tahap bantuan, dan daftar siswa/guru prioritas.
- **Data Sekolah (Dapodik CRUD)**:
  - *Data Siswa*: Biodata, NISN, status bantuan (KIP/KJP), kehadiran, tambah siswa baru (`POST /api/admin/siswa`).
  - *Data Guru*: NIP, mapel, status kepegawaian (PNS/PPPK/Honorer), sertifikasi.
  - *Data Kelas*: Wali kelas, komposisi gender siswa, dan jadwal pelajaran mingguan.
  - *Fasilitas & Sarpras*: Tambah fasilitas baru (`POST /api/admin/fasilitas`), kelola kondisi alat baik vs rusak, dan pengajuan renovasi.
- **Profil Sekolah**: Legalitas identitas (NPSN, Akreditasi, Kontak resmi, Rekap operasional) dengan mode edit tersimpan ke DB (`PUT /api/admin/profil-sekolah`) dan upload foto sekolah.
- **Kebutuhan & Bantuan**:
  - *Verifikasi Usulan Guru*: Disposisi persetujuan (Setujui Masuk RKAS, Teruskan ke Dinas, Minta Revisi Data, Tolak).
  - *Pelacakan Distribusi Logistik*: Status ekspedisi pengiriman bantuan dari pemerintah.
  - *Cetak Dokumen Resmi BAST*: Generator Berita Acara Serah Terima (BAST) berstandar kementerian dengan Kop Surat resmi, nomor registrasi surat, dan blok tanda tangan ganda (Kepala Sekolah & Pihak Penyalur).

---

### 3. 🏛️ Web Pemerintah / Dinas Pendidikan (`/pemerintah`)
- **Dashboard Pengawasan Wilayah**: Ringkasan 248 sekolah se-provinsi, total murid & guru terdaftar, pemetaan prioritas sarpras rusak, dan realisasi anggaran DAK Fisik.
- **Monitoring Database Sekolah**: Data komprehensif profil sekolah, data agregat siswa, guru, rombel kelas, dan kondisi sarpras.
- **Bank Materi Kurikulum Nasional**: Tambah materi baru (`POST /api/pemerintah/materi`) yang otomatis tersedia untuk semua akun guru.
- **Persetujuan & Alokasi Bantuan**:
  - Evaluasi proposal kebutuhan yang diteruskan oleh Admin Sekolah.
  - Alokasi jenis bantuan (Barang, Fasilitas, Layanan, Dana) serta penerbitan nomor resi pengiriman ekspedisi logistik.
  - Tombol penolakan usulan (*Tolak Pengajuan*) yang tersinkronisasi langsung ke backend (`PUT /api/pemerintah/kebutuhan/{id}/reject`).
- **Laporan & Ekspor**: Ekspor rekapitulasi data sekolah ke CSV dan cetak PDF resmi ber-Kop Dinas Pendidikan.

---

## 🔑 Kredensial Demo Akun

Semua akun terdaftar menggunakan password standar: `password`

| Peran | Email | Password | Akses Portal |
|---|---|---|---|
| **Guru** | `guru@merata.id` | `password` | `/guru` (Web Guru) |
| **Admin Sekolah** | `admin@merata.id` | `password` | `/admin` (Web Administrasi) |
| **Pemerintah** | `pemerintah@merata.id` | `password` | `/pemerintah` (Web Pemerintah) |

*(Tersedia juga fitur Quick Demo Switcher di halaman Login untuk langsung masuk tanpa mengetik kredensial).*

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS, Responsive Flex/Grid, Glassmorphism, Modern Card Shadows
- **Icons**: Lucide React
- **Audio Synthesizer**: Zero-dependency Web Audio API sound generator (`audioUtils.js`)
- **Gamification Particle**: HTML5 Canvas confetti emitter (`confettiUtils.js`)
- **Export Utilities**: RFC 4180 CSV export & dynamic printable document generator (BAST & Laporan PDF)

### Backend
- **Framework**: Laravel 12
- **Authentication**: Laravel Sanctum (Token-based API authentication)
- **Database**: SQLite / MySQL dengan Eloquent ORM
- **File Storage**: Laravel Storage (`public/storage` symlink) untuk foto profil dan foto sarpras
- **API Architecture**: RESTful JSON endpoints with CORS support

---

## 📡 Daftar Endpoint API Utama

### 🔐 Autentikasi (`/api/auth`)
- `POST /api/auth/login` - Login pengguna & generate Sanctum token.
- `GET /api/auth/me` - Ambil profil pengguna yang sedang login.
- `POST /api/auth/logout` - Revoke current Sanctum token.

### 🎓 Web Guru (`/api/guru`)
- `GET /api/guru/profil` - Ambil data profil guru & daftar kebutuhan yang diajukan.
- `PUT /api/guru/profil` - Update profil guru.
- `POST /api/guru/kebutuhan` - Ajukan usulan kebutuhan baru.
- `GET /api/guru/kelas/{id}` - Detail kelas & daftar siswa.
- `POST /api/guru/kelas/{id}/presensi` - Simpan presensi harian siswa.
- `GET /api/guru/kelas/{id}/quiz` - Bank soal quiz kelas.
- `GET /api/guru/kelas/{id}/game` - Dataset game edukasi.
- `GET /api/guru/monitoring` - Rekam monitoring dan capaian nilai siswa.
- `PUT /api/guru/siswa/{id}` - Update rekam nilai, catatan guru, dan status kehadiran siswa.

### 🏫 Web Admin Sekolah (`/api/admin`)
- `GET /api/admin/profil-sekolah` - Ambil profil sekolah & data statistik.
- `PUT /api/admin/profil-sekolah` - Perbarui profil sekolah.
- `GET /api/admin/siswa` - Daftar siswa sekolah.
- `POST /api/admin/siswa` - Tambah data siswa baru.
- `GET /api/admin/guru` - Daftar dewan guru.
- `GET /api/admin/kelas` - Rombongan belajar & wali kelas.
- `GET /api/admin/fasilitas` - Daftar sarana prasarana sekolah.
- `POST /api/admin/fasilitas` - Tambah sarana prasarana baru.
- `GET /api/admin/verifikasi` - Daftar verifikasi proposal kebutuhan.
- `PUT /api/admin/verifikasi/{id}` - Update status disposisi usulan (Disetujui RKAS, Diteruskan ke Pemda, Ditolak).
- `GET /api/admin/bantuan` - Riwayat dan tracking distribusi bantuan.

### 🏛️ Web Pemerintah (`/api/pemerintah`)
- `GET /api/pemerintah/sekolah` - Daftar seluruh sekolah se-wilayah binaan.
- `GET /api/pemerintah/kebutuhan` - Daftar usulan bantuan yang masuk dari seluruh sekolah.
- `PUT /api/pemerintah/kebutuhan/{id}/approve` - Setujui alokasi bantuan & buat pengiriman logistik.
- `PUT /api/pemerintah/kebutuhan/{id}/reject` - Tolak pengajuan bantuan.
- `GET /api/pemerintah/materi` - Daftar modul kurikulum nasional.
- `POST /api/pemerintah/materi` - Terbitkan modul ajar kurikulum nasional baru.

### 📁 Upload File Storage (`/api/upload`)
- `POST /api/upload` - Multipart form-data upload file (avatar / foto sarpras, format JPG/PNG/WEBP/PDF, max 10MB).

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Setup Backend (Laravel)

1. Masuk ke direktori backend:
   ```bash
   cd c:\MERATA\backend
   ```
2. Salin environment file (jika belum ada):
   ```bash
   cp .env.example .env
   ```
3. Generate application key:
   ```bash
   php artisan key:generate
   ```
4. Hubungkan penyimpanan publik untuk file upload:
   ```bash
   php artisan storage:link
   ```
5. Jalankan migrasi dan seeder data lengkap:
   ```bash
   php artisan migrate:fresh --seed
   ```
6. Jalankan server Laravel API:
   ```bash
   php artisan serve --port=8000
   ```
   *API backend akan aktif di: `http://127.0.0.1:8000`*

---

### 2. Setup Frontend (React + Vite)

1. Masuk ke direktori frontend:
   ```bash
   cd c:\MERATA\FRONTEND
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   *Frontend aplikasi akan aktif di: `http://localhost:3000` (atau `http://localhost:5173`)*

---

## 📁 Struktur Direktori Proyek

```text
MERATA/
├── PRD.Md                        # Product Requirement Document
├── README.md                     # Dokumentasi Lengkap Proyek
├── backend/                      # Backend Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/ # AuthController, GuruController, AdminController,
│   │   │                         # PemerintahController, UploadController, KebutuhanController
│   │   └── Models/               # User, Sekolah, Siswa, Guru, Kelas, Fasilitas, Kebutuhan, Bantuan
│   ├── config/cors.php           # CORS whitelist untuk Frontend Vite
│   ├── database/
│   │   ├── migrations/           # Skema tabel database relasional
│   │   └── seeders/              # DatabaseSeeder, GuruSeeder, AdminSeeder, etc.
│   └── routes/
│       └── api.php               # Definisi route RESTful API
└── FRONTEND/                     # Frontend SPA React 18 + Vite
    ├── index.html                # HTML entry & SEO meta
    ├── package.json              # Paket & dependensi
    ├── vite.config.js            # Port & proxy setup
    ├── tailwind.config.js        # Desain token & tema
    └── src/
        ├── App.jsx               # Lifecycle Orchestrator & Live State Sync
        ├── main.jsx              # Entry point aplikasi
        ├── index.css             # Glassmorphism & custom utility styles
        ├── components/
        │   ├── auth/             # Login Portal & Demo Switcher
        │   ├── guru/             # Dashboard, Kelas, Game, Quiz, Monitoring, Profil
        │   ├── admin/            # Dashboard, DataSekolah, KebutuhanBantuan, Profil
        │   ├── pemerintah/       # Dashboard, Monitoring, BankMateri, Persetujuan, Laporan
        │   └── layout/           # Sidebar & Header responsif dengan Live Notifications
        ├── services/
        │   ├── api.js            # HTTP Client terpusat (Sanctum Bearer Token)
        │   └── adapters.js       # Transformasi skema snake_case <-> camelCase
        └── utils/                # Audio Synthesizer, Confetti Canvas, Export CSV & BAST Generator
```

---

## 📄 Lisensi
Hak Cipta © 2026 **MERATA Team**. Dikembangkan untuk percepatan kemajuan dan pemerataan pendidikan berkualitas di seluruh penjuru Indonesia.
