export const mockTeacherProfile = {
  nama: 'Budi Santoso, S.Kom, S.Pd.',
  nip: '198203152006041003',
  peran: 'Guru Matematika & Informatika',
  sekolah: 'SMP Negeri 1 Merata',
  lamaMengajar: '18 Tahun',
  sertifikasi: 'Pendidik Profesional (Kemendikbudristek)',
  poinKontribusi: 450,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  telepon: '0812-3456-7890',
  email: 'budi.santoso@guru.merata.id',
  keahlian: ['Matematika Kelas 5-8', 'Coding Scratch & Python', 'Media Pembelajaran Digital STEM'],
};

export const mockTodaySchedule = [
  {
    id: 1,
    jam: '07.30 - 09.00',
    kelas: 'Kelas 5A',
    mapel: 'Matematika Dasar',
    topik: 'Pecahan: Pengenalan & Pecahan Biasa',
    ruang: 'Ruang 102',
    status: 'Sedang Berlangsung',
    jumlahSiswa: 32,
    kehadiran: '31/32 Hadir',
  },
  {
    id: 2,
    jam: '09.30 - 11.00',
    kelas: 'Kelas 7A',
    mapel: 'Informatika & TIK',
    topik: 'Algoritma Pemrograman Blok (Scratch)',
    ruang: 'Lab Komputer 1',
    status: 'Berikutnya',
    jumlahSiswa: 36,
    kehadiran: '36/36 Hadir',
  },
  {
    id: 3,
    jam: '13.00 - 14.30',
    kelas: 'Kelas 8B',
    mapel: 'Matematika Aljabar',
    topik: 'Persamaan Linear Satu Variabel',
    ruang: 'Ruang 204',
    status: 'Nanti Siang',
    jumlahSiswa: 38,
    kehadiran: 'Menunggu',
  },
];

export const mockGuruClasses = [
  {
    id: 'KLS-5A',
    nama: 'Kelas 5A',
    jenjang: 'SD / Fase C',
    mapel: 'Matematika',
    jumlahSiswa: 32,
    kehadiranRata: '97.5%',
    nilaiRata: 84.8,
    status: 'Aktif',
    topikAktif: 'Pecahan (Fractions)',
    progressMateri: 65,
  },
  {
    id: 'KLS-7A',
    nama: 'Kelas 7A',
    jenjang: 'SMP / Fase D',
    mapel: 'Informatika & TIK',
    jumlahSiswa: 36,
    kehadiranRata: '98.2%',
    nilaiRata: 88.0,
    status: 'Aktif',
    topikAktif: 'Berpikir Komputasional',
    progressMateri: 80,
  },
  {
    id: 'KLS-8B',
    nama: 'Kelas 8B',
    jenjang: 'SMP / Fase D',
    mapel: 'Matematika',
    jumlahSiswa: 38,
    kehadiranRata: '91.8%',
    nilaiRata: 76.5,
    status: 'Perlu Penguatan',
    topikAktif: 'Aljabar & Persamaan Linear',
    progressMateri: 45,
  },
];

// Complete Material Structure for Kelas 5A -> Matematika -> Pecahan
export const mockPecahanMaterial = {
  kelas: 'Kelas 5A',
  mapel: 'Matematika',
  topikUtama: 'Pecahan (Fractions)',
  deskripsi: 'Memahami konsep dasar bagian dari keseluruhan, operasi hitung pecahan, dan aplikasinya dalam kehidupan nyata.',
  submateri: [
    {
      id: 'sub-1',
      nomor: 1,
      judul: 'Mengenal Konsep Pecahan',
      durasi: '2 JP (70 Menit)',
      tujuan: [
        'Siswa mampu mendefinisikan pecahan sebagai bagian dari keseluruhan yang bernilai sama.',
        'Siswa mampu mengidentifikasi pembilang (numerator) dan penyebut (denominator).',
        'Siswa dapat menyajikan pecahan dalam bentuk gambar bangun datar (arsir).'
      ],
      materiUtama: `Pecahan adalah bilangan yang menyatakan bagian dari sebuah keutuhan atau kelompok.
      
Jika sebuah kue dipotong menjadi 4 bagian yang sama besar, maka 1 potong kue tersebut bernilai 1/4 (satu per empat) bagian dari seluruh kue.

Komponen Pecahan:
• Angka di atas disebut Pembilang (menunjukkan jumlah bagian yang diambil).
• Angka di bawah disebut Penyebut (menunjukkan jumlah seluruh bagian yang sama).`,
      ilustrasi: {
        tipe: 'pie',
        label: '1 dari 4 bagian kue = 1/4 (25%)',
        caption: 'Gambar lingkaran dibagi 4 juring sama besar dengan 1 juring berwarna biru.',
      },
      video: {
        judul: 'Animasi Interaktif: Rahasia Memahami Pecahan dalam 3 Menit',
        durasi: '04:15',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
        deskripsiVideo: 'Video penjelasan visual mengenai potongan pizza dan pembagian kue cokelat.',
      },
      contohSoal: [
        {
          soal: 'Ibu memotong sebuah melon menjadi 8 potong sama besar. Budi memakan 3 potong melon. Berapa bagian melon yang dimakan Budi?',
          jawaban: '3/8 bagian',
          pembahasan: 'Jumlah potongan yang dimakan Budi = 3 (Pembilang). Total seluruh potongan melon = 8 (Penyebut). Maka pecahannya adalah 3/8.'
        },
        {
          soal: 'Sebuah persegi dibagi menjadi 6 kotak persegi panjang yang sama. Jika 4 kotak diwarnai merah, berapa pecahan kotak yang berwarna merah?',
          jawaban: '4/6 atau disederhanakan menjadi 2/3',
          pembahasan: 'Kotak merah = 4, total kotak = 6. Pecahannya = 4/6 = (4÷2)/(6÷2) = 2/3.'
        }
      ],
      slides: [
        { slideNo: 1, judul: 'Definisi Pecahan', konten: 'Pecahan = Bagian dari satu benda utuh yang dibagi sama besar.' },
        { slideNo: 2, judul: 'Struktur: Pembilang / Penyebut', konten: 'Pembilang (atas) = Bagian yang diambil\nPenyebut (bawah) = Total bagian utuh.' },
        { slideNo: 3, judul: 'Contoh Visual Pizza', konten: '1 loyang pizza 8 potong. Jika tersisa 5 potong, maka pecahannya 5/8.' }
      ]
    },
    {
      id: 'sub-2',
      nomor: 2,
      judul: 'Pecahan Biasa dan Pecahan Desimal',
      durasi: '2 JP (70 Menit)',
      tujuan: [
        'Siswa dapat membedakan pecahan biasa murni dan pecahan tidak murni.',
        'Siswa mampu mengubah pecahan biasa berpenyebut 10, 100, 1000 ke bentuk desimal.'
      ],
      materiUtama: `Pecahan Biasa terbagi menjadi:
1. Pecahan Murni: Pembilang lebih kecil dari penyebut (contoh: 2/5, 3/7).
2. Pecahan Tidak Murni: Pembilang lebih besar atau sama dengan penyebut (contoh: 7/4, 9/5).

Mengubah Pecahan ke Desimal:
• 1/2 = (1×5)/(2×5) = 5/10 = 0,5
• 3/4 = (3×25)/(4×25) = 75/100 = 0,75
• 1/5 = (1×2)/(5×2) = 2/10 = 0,2`,
      ilustrasi: {
        tipe: 'bar',
        label: '1/2 sama dengan 0.50 (50%)',
        caption: 'Tabel ekuivalensi pecahan ke bentuk desimal dan persentase.',
      },
      video: {
        judul: 'Trik Cepat Mengubah Pecahan ke Desimal Tanpa Porogapit',
        durasi: '05:30',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
        deskripsiVideo: 'Cara mengalikan penyebut menjadi kelipatan 10, 100, atau 1000.',
      },
      contohSoal: [
        {
          soal: 'Ubahlah pecahan 4/5 menjadi bentuk pecahan desimal!',
          jawaban: '0,8',
          pembahasan: 'Kalikan pembilang dan penyebut dengan 2: (4×2)/(5×2) = 8/10 = 0,8.'
        }
      ],
      slides: [
        { slideNo: 1, judul: 'Pecahan Murni vs Tidak Murni', konten: '3/5 (Murni) | 7/3 (Tidak Murni = bisa jadi pecahan campuran).' },
        { slideNo: 2, judul: 'Konversi ke Desimal', konten: 'Penyebut dijadikan 10, 100, atau 1000.' }
      ]
    },
    {
      id: 'sub-3',
      nomor: 3,
      judul: 'Pecahan Campuran',
      durasi: '2 JP (70 Menit)',
      tujuan: [
        'Siswa mampu mengenali bentuk pecahan campuran (bilangan bulat + pecahan biasa).',
        'Siswa mampu mengubah pecahan tidak murni menjadi pecahan campuran dan sebaliknya.'
      ],
      materiUtama: `Pecahan Campuran terdiri dari bilangan bulat dan pecahan biasa.
Contoh: 2 1/3 (dibaca dua satu per tiga).

Cara mengubah 7/3 menjadi pecahan campuran:
1. Bagi 7 dengan 3 -> Hasil bulat = 2, Sisa = 1.
2. Tuliskan hasilnya: 2 1/3.`,
      ilustrasi: {
        tipe: 'pie',
        label: '2 Lingkaran Penuh + 1/3 Lingkaran = 2 1/3',
        caption: 'Visualisasi penjumlahan unit bulat dan pecahan pecahan sisa.',
      },
      video: {
        judul: 'Memahami Pecahan Campuran dengan Cerita Buah Apel',
        durasi: '03:45',
        thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=600',
        deskripsiVideo: 'Ilustrasi pembagian apel utuh dan potongan apel.',
      },
      contohSoal: [
        {
          soal: 'Ubahlah 11/4 menjadi pecahan campuran!',
          jawaban: '2 3/4',
          pembahasan: '11 ÷ 4 = 2 sisa 3. Jadi bentuk campurannya adalah 2 3/4.'
        }
      ],
      slides: [
        { slideNo: 1, judul: 'Konsep Pecahan Campuran', konten: 'Ada bagian utuh + ada bagian sisa potongan.' }
      ]
    },
    {
      id: 'sub-4',
      nomor: 4,
      judul: 'Membandingkan dan Mengurutkan Pecahan',
      durasi: '2 JP (70 Menit)',
      tujuan: [
        'Siswa mampu membandingkan dua pecahan dengan tanda <, >, atau =.',
        'Siswa mampu menyamakan penyebut menggunakan KPK.'
      ],
      materiUtama: `Untuk membandingkan dua pecahan:
1. Jika penyebutnya sama, bandingkan pembilangnya langsung (3/7 > 2/7).
2. Jika penyebutnya berbeda, samakan penyebutnya terlebih dahulu dengan KPK atau perkalian silang (cross multiplication).

Metode Kali Silang (Cross Product):
Membandingkan 2/3 dengan 3/4:
• Sisi kiri: 2 × 4 = 8
• Sisi kanan: 3 × 3 = 9
Karena 8 < 9, maka 2/3 < 3/4.`,
      ilustrasi: {
        tipe: 'compare',
        label: '2/3 < 3/4 (0.67 < 0.75)',
        caption: 'Grafik batang perbandingan tinggi nilai pecahan.',
      },
      video: {
        judul: 'Trik Rahasia Kali Silang Cepat Membandingkan Pecahan',
        durasi: '04:00',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
        deskripsiVideo: 'Teknik cepat membandingkan tanpa perlu mencari KPK panjang.',
      },
      contohSoal: [
        {
          soal: 'Bandingkan pecahan 3/5 dan 4/7 dengan tanda yang tepat!',
          jawaban: '3/5 > 4/7',
          pembahasan: 'Kali silang: 3 × 7 = 21, sedangkan 5 × 4 = 20. Karena 21 > 20, maka 3/5 > 4/7.'
        }
      ],
      slides: [
        { slideNo: 1, judul: 'Aturan Perbandingan Pecahan', konten: 'Penyebut sama = lihat atas. Penyebut beda = kali silang.' }
      ]
    },
    {
      id: 'sub-5',
      nomor: 5,
      judul: 'Penjumlahan dan Pengurangan Pecahan',
      durasi: '4 JP (140 Menit)',
      tujuan: [
        'Siswa dapat menjumlahkan dan mengurangkan pecahan dengan penyebut yang sama.',
        'Siswa dapat menyelesaikan operasi hitung pecahan dengan penyebut berbeda melalui KPK.'
      ],
      materiUtama: `1. Penyebut Sama:
1/5 + 2/5 = (1+2)/5 = 3/5
4/7 - 1/7 = (4-1)/7 = 3/7

2. Penyebut Berbeda:
1/2 + 1/3 = ?
KPK dari 2 dan 3 adalah 6.
(1×3)/6 + (1×2)/6 = 3/6 + 2/6 = 5/6.`,
      ilustrasi: {
        tipe: 'addition',
        label: '1/2 + 1/3 = 3/6 + 2/6 = 5/6',
        caption: 'Visualisasi menyamakan kisi petak penyebut menjadi 6 bagian.',
      },
      video: {
        judul: 'Langkah Mudah Penjumlahan & Pengurangan Pecahan Berpenyebut Beda',
        durasi: '06:10',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
        deskripsiVideo: 'Tutorial bertahap mencari KPK dan menjumlahkan pecahan.',
      },
      contohSoal: [
        {
          soal: 'Hitunglah hasil dari 2/3 + 1/4!',
          jawaban: '11/12',
          pembahasan: 'KPK dari 3 dan 4 adalah 12. (2×4)/12 + (1×3)/12 = 8/12 + 3/12 = 11/12.'
        }
      ],
      slides: [
        { slideNo: 1, judul: 'Operasi Pecahan Dasar', konten: 'Syarat mutlak: Penyebut harus disamakan terlebih dahulu!' }
      ]
    }
  ]
};

// Interactive Matching Cards Dataset
export const initialMatchingCards = [
  { id: 1, pairId: 'p1', value: '1/2', type: 'Pecahan Biasa' },
  { id: 2, pairId: 'p1', value: '0,50 (50%)', type: 'Nilai Desimal' },
  { id: 3, pairId: 'p2', value: '1/4', type: 'Pecahan Biasa' },
  { id: 4, pairId: 'p2', value: '0,25 (25%)', type: 'Nilai Desimal' },
  { id: 5, pairId: 'p3', value: '3/4', type: 'Pecahan Biasa' },
  { id: 6, pairId: 'p3', value: '0,75 (75%)', type: 'Nilai Desimal' },
  { id: 7, pairId: 'p4', value: '1/5', type: 'Pecahan Biasa' },
  { id: 8, pairId: 'p4', value: '0,20 (20%)', type: 'Nilai Desimal' },
];

// Interactive Ordering Game Dataset
export const orderingGameInitial = [
  { id: 'item-1', label: '3/4', desimal: '0,75', value: 0.75 },
  { id: 'item-2', label: '1/4', desimal: '0,25', value: 0.25 },
  { id: 'item-3', label: '1/2', desimal: '0,50', value: 0.50 },
  { id: 'item-4', label: '1 (Utuh)', desimal: '1,00', value: 1.00 },
];

// Interactive Quiz Data
export const mockQuizData = {
  id: 'QZ-PEC-01',
  judul: 'Quiz Evaluasi: Pemahaman Dasar Pecahan',
  topik: 'Matematika Kelas 5A - Bab 2 Pecahan',
  durasiMenit: 10,
  kkm: 75,
  deskripsi: 'Uji pemahaman konsep pecahan biasa, desimal, campuran, dan operasi hitung.',
  soal: [
    {
      id: 1,
      pertanyaan: 'Sebuah semangka dipotong menjadi 6 bagian sama besar. Dina memakan 2 potong. Bagian semangka yang dimakan Dina adalah...',
      opsi: ['1/6 bagian', '2/6 (atau 1/3) bagian', '2/4 bagian', '4/6 bagian'],
      kunci: 1, // index B
      penjelasan: 'Dina memakan 2 dari 6 potong total, jadi bernilai 2/6. Jika disederhanakan dibagi 2 menjadi 1/3.'
    },
    {
      id: 2,
      pertanyaan: 'Bentuk pecahan desimal dari pecahan 3/4 adalah...',
      opsi: ['0,34', '0,50', '0,75', '0,80'],
      kunci: 2, // index C
      penjelasan: '3/4 = (3 × 25) / (4 × 25) = 75/100 = 0,75.'
    },
    {
      id: 3,
      pertanyaan: 'Tanda perbandingan yang tepat untuk 3/5 ... 2/3 adalah...',
      opsi: ['< (Lebih kecil)', '> (Lebih besar)', '= (Sama dengan)', '>= (Lebih besar atau sama)'],
      kunci: 0, // index A
      penjelasan: 'Kali silang: 3 × 3 = 9, sedangkan 5 × 2 = 10. Karena 9 < 10, maka 3/5 < 2/3.'
    },
    {
      id: 4,
      pertanyaan: 'Bentuk pecahan campuran dari 14/5 adalah...',
      opsi: ['2 4/5', '3 1/5', '2 3/5', '1 4/5'],
      kunci: 0, // index A
      penjelasan: '14 dibagi 5 menghasilkan 2 dengan sisa 4, maka bentuk campurannya adalah 2 4/5.'
    },
    {
      id: 5,
      pertanyaan: 'Hasil dari penjumlahan 1/3 + 1/2 adalah...',
      opsi: ['2/5', '5/6', '1/6', '2/6'],
      kunci: 1, // index B
      penjelasan: 'KPK 3 dan 2 adalah 6. (1×2)/6 + (1×3)/6 = 2/6 + 3/6 = 5/6.'
    }
  ]
};

// Teacher Needs History
export const initialTeacherNeeds = [
  {
    id: 'TND-01',
    judul: '15 Unit Laptop Lab Komputer & ANBK',
    kategori: 'Perangkat Pembelajaran IT',
    tanggal: '28 Agt 2026',
    status: 'Menunggu Verifikasi Sekolah',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    biaya: 'Rp 105.000.000',
    keterangan: 'Untuk pembelajaran praktikum coding dan asesmen siswa.'
  },
  {
    id: 'TND-02',
    judul: 'Kit Alat Peraga Matematika 3D & Pecahan',
    kategori: 'Bahan Ajar & Alat Peraga',
    tanggal: '15 Agt 2026',
    status: 'Disetujui Sekolah & Diteruskan ke Pemda',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    biaya: 'Rp 3.500.000',
    keterangan: 'Peraga visual bentuk pecahan untuk 3 rombel Fase C.'
  },
  {
    id: 'TND-03',
    judul: 'Pelatihan Pembuatan Media Ajar Berbasis STEM',
    kategori: 'Pelatihan Guru',
    tanggal: '10 Agt 2026',
    status: 'Bantuan Diterima',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    biaya: 'Gratis (Program Daring)',
    keterangan: 'Sertifikat telah diterbitkan oleh Balai Guru Penggerak.'
  }
];
