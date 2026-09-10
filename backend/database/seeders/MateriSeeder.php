<?php

namespace Database\Seeders;

use App\Models\GameDataset;
use App\Models\Materi;
use App\Models\Quiz;
use App\Models\QuizSoal;
use App\Models\Submateri;
use Illuminate\Database\Seeder;

class MateriSeeder extends Seeder
{
    public function run(): void
    {
        // From mockPemerintahData.js → initialCurriculumMaterials (3 materi)
        $mat1 = Materi::create([
            'kode' => 'MAT-001',
            'jenjang' => 'SD / Fase C',
            'kelas' => 'Kelas 5 SD',
            'mapel' => 'Matematika',
            'topik' => 'Pecahan (Fractions)',
            'jumlah_submateri' => 5,
            'author' => 'Puskurjar Kemendikbudristek & Tim Pengembang DKI',
            'tanggal_terbit' => '15 Agt 2026',
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => 'Memahami konsep dasar bagian dari keseluruhan, operasi hitung pecahan biasa, campuran, desimal, dan aplikasinya.',
        ]);

        Materi::create([
            'kode' => 'MAT-002',
            'jenjang' => 'SMP / Fase D',
            'kelas' => 'Kelas 7 SMP',
            'mapel' => 'Informatika & TIK',
            'topik' => 'Berpikir Komputasional & Algoritma Blok',
            'jumlah_submateri' => 4,
            'author' => 'Direktorat SMP Kemendikbudristek',
            'tanggal_terbit' => '20 Agt 2026',
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => 'Pengenalan pola algoritma, dekomposisi masalah, dan implementasi coding visual Scratch.',
        ]);

        Materi::create([
            'kode' => 'MAT-003',
            'jenjang' => 'SMP / Fase D',
            'kelas' => 'Kelas 8 SMP',
            'mapel' => 'Matematika',
            'topik' => 'Aljabar & Persamaan Linear Satu Variabel',
            'jumlah_submateri' => 4,
            'author' => 'Balai Guru Penggerak DKI Jakarta',
            'tanggal_terbit' => '22 Agt 2026',
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => 'Konsep variabel, koefisien, konstanta, dan penyelesaian masalah kontekstual persamaan aljabar.',
        ]);

        // From mockGuruData.js → mockPecahanMaterial.submateri (5 submateri for MAT-001)
        $submateris = [
            [
                'nomor' => 1,
                'judul' => 'Mengenal Konsep Pecahan',
                'durasi' => '2 JP (70 Menit)',
                'tujuan' => [
                    'Siswa mampu mendefinisikan pecahan sebagai bagian dari keseluruhan yang bernilai sama.',
                    'Siswa mampu mengidentifikasi pembilang (numerator) dan penyebut (denominator).',
                    'Siswa dapat menyajikan pecahan dalam bentuk gambar bangun datar (arsir).',
                ],
                'materi_utama' => "Pecahan adalah bilangan yang menyatakan bagian dari sebuah keutuhan atau kelompok.\n\nJika sebuah kue dipotong menjadi 4 bagian yang sama besar, maka 1 potong kue tersebut bernilai 1/4 (satu per empat) bagian dari seluruh kue.\n\nKomponen Pecahan:\n• Angka di atas disebut Pembilang (menunjukkan jumlah bagian yang diambil).\n• Angka di bawah disebut Penyebut (menunjukkan jumlah seluruh bagian yang sama).",
                'ilustrasi' => ['tipe' => 'pie', 'label' => '1 dari 4 bagian kue = 1/4 (25%)', 'caption' => 'Gambar lingkaran dibagi 4 juring sama besar dengan 1 juring berwarna biru.'],
                'video' => ['judul' => 'Animasi Interaktif: Rahasia Memahami Pecahan dalam 3 Menit', 'durasi' => '04:15', 'thumbnail' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600', 'deskripsiVideo' => 'Video penjelasan visual mengenai potongan pizza dan pembagian kue cokelat.'],
                'contoh_soal' => [
                    ['soal' => 'Ibu memotong sebuah melon menjadi 8 potong sama besar. Budi memakan 3 potong melon. Berapa bagian melon yang dimakan Budi?', 'jawaban' => '3/8 bagian', 'pembahasan' => 'Jumlah potongan yang dimakan Budi = 3 (Pembilang). Total seluruh potongan melon = 8 (Penyebut). Maka pecahannya adalah 3/8.'],
                    ['soal' => 'Sebuah persegi dibagi menjadi 6 kotak persegi panjang yang sama. Jika 4 kotak diwarnai merah, berapa pecahan kotak yang berwarna merah?', 'jawaban' => '4/6 atau disederhanakan menjadi 2/3', 'pembahasan' => 'Kotak merah = 4, total kotak = 6. Pecahannya = 4/6 = (4÷2)/(6÷2) = 2/3.'],
                ],
                'slides' => [
                    ['slideNo' => 1, 'judul' => 'Definisi Pecahan', 'konten' => 'Pecahan = Bagian dari satu benda utuh yang dibagi sama besar.'],
                    ['slideNo' => 2, 'judul' => 'Struktur: Pembilang / Penyebut', 'konten' => "Pembilang (atas) = Bagian yang diambil\nPenyebut (bawah) = Total bagian utuh."],
                    ['slideNo' => 3, 'judul' => 'Contoh Visual Pizza', 'konten' => '1 loyang pizza 8 potong. Jika tersisa 5 potong, maka pecahannya 5/8.'],
                ],
            ],
            [
                'nomor' => 2,
                'judul' => 'Pecahan Biasa dan Pecahan Desimal',
                'durasi' => '2 JP (70 Menit)',
                'tujuan' => [
                    'Siswa dapat membedakan pecahan biasa murni dan pecahan tidak murni.',
                    'Siswa mampu mengubah pecahan biasa berpenyebut 10, 100, 1000 ke bentuk desimal.',
                ],
                'materi_utama' => "Pecahan Biasa terbagi menjadi:\n1. Pecahan Murni: Pembilang lebih kecil dari penyebut (contoh: 2/5, 3/7).\n2. Pecahan Tidak Murni: Pembilang lebih besar atau sama dengan penyebut (contoh: 7/4, 9/5).\n\nMengubah Pecahan ke Desimal:\n• 1/2 = (1×5)/(2×5) = 5/10 = 0,5\n• 3/4 = (3×25)/(4×25) = 75/100 = 0,75\n• 1/5 = (1×2)/(5×2) = 2/10 = 0,2",
                'ilustrasi' => ['tipe' => 'bar', 'label' => '1/2 sama dengan 0.50 (50%)', 'caption' => 'Tabel ekuivalensi pecahan ke bentuk desimal dan persentase.'],
                'video' => ['judul' => 'Trik Cepat Mengubah Pecahan ke Desimal Tanpa Porogapit', 'durasi' => '05:30', 'thumbnail' => 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600', 'deskripsiVideo' => 'Cara mengalikan penyebut menjadi kelipatan 10, 100, atau 1000.'],
                'contoh_soal' => [
                    ['soal' => 'Ubahlah pecahan 4/5 menjadi bentuk pecahan desimal!', 'jawaban' => '0,8', 'pembahasan' => 'Kalikan pembilang dan penyebut dengan 2: (4×2)/(5×2) = 8/10 = 0,8.'],
                ],
                'slides' => [
                    ['slideNo' => 1, 'judul' => 'Pecahan Murni vs Tidak Murni', 'konten' => '3/5 (Murni) | 7/3 (Tidak Murni = bisa jadi pecahan campuran).'],
                    ['slideNo' => 2, 'judul' => 'Konversi ke Desimal', 'konten' => 'Penyebut dijadikan 10, 100, atau 1000.'],
                ],
            ],
            [
                'nomor' => 3,
                'judul' => 'Pecahan Campuran',
                'durasi' => '2 JP (70 Menit)',
                'tujuan' => [
                    'Siswa mampu mengenali bentuk pecahan campuran (bilangan bulat + pecahan biasa).',
                    'Siswa mampu mengubah pecahan tidak murni menjadi pecahan campuran dan sebaliknya.',
                ],
                'materi_utama' => "Pecahan Campuran terdiri dari bilangan bulat dan pecahan biasa.\nContoh: 2 1/3 (dibaca dua satu per tiga).\n\nCara mengubah 7/3 menjadi pecahan campuran:\n1. Bagi 7 dengan 3 -> Hasil bulat = 2, Sisa = 1.\n2. Tuliskan hasilnya: 2 1/3.",
                'ilustrasi' => ['tipe' => 'pie', 'label' => '2 Lingkaran Penuh + 1/3 Lingkaran = 2 1/3', 'caption' => 'Visualisasi penjumlahan unit bulat dan pecahan pecahan sisa.'],
                'video' => ['judul' => 'Memahami Pecahan Campuran dengan Cerita Buah Apel', 'durasi' => '03:45', 'thumbnail' => 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=600', 'deskripsiVideo' => 'Ilustrasi pembagian apel utuh dan potongan apel.'],
                'contoh_soal' => [
                    ['soal' => 'Ubahlah 11/4 menjadi pecahan campuran!', 'jawaban' => '2 3/4', 'pembahasan' => '11 ÷ 4 = 2 sisa 3. Jadi bentuk campurannya adalah 2 3/4.'],
                ],
                'slides' => [
                    ['slideNo' => 1, 'judul' => 'Konsep Pecahan Campuran', 'konten' => 'Ada bagian utuh + ada bagian sisa potongan.'],
                ],
            ],
            [
                'nomor' => 4,
                'judul' => 'Membandingkan dan Mengurutkan Pecahan',
                'durasi' => '2 JP (70 Menit)',
                'tujuan' => [
                    'Siswa mampu membandingkan dua pecahan dengan tanda <, >, atau =.',
                    'Siswa mampu menyamakan penyebut menggunakan KPK.',
                ],
                'materi_utama' => "Untuk membandingkan dua pecahan:\n1. Jika penyebutnya sama, bandingkan pembilangnya langsung (3/7 > 2/7).\n2. Jika penyebutnya berbeda, samakan penyebutnya terlebih dahulu dengan KPK atau perkalian silang.\n\nMetode Kali Silang:\nMembandingkan 2/3 dengan 3/4:\n• Sisi kiri: 2 × 4 = 8\n• Sisi kanan: 3 × 3 = 9\nKarena 8 < 9, maka 2/3 < 3/4.",
                'ilustrasi' => ['tipe' => 'compare', 'label' => '2/3 < 3/4 (0.67 < 0.75)', 'caption' => 'Grafik batang perbandingan tinggi nilai pecahan.'],
                'video' => ['judul' => 'Trik Rahasia Kali Silang Cepat Membandingkan Pecahan', 'durasi' => '04:00', 'thumbnail' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600', 'deskripsiVideo' => 'Teknik cepat membandingkan tanpa perlu mencari KPK panjang.'],
                'contoh_soal' => [
                    ['soal' => 'Bandingkan pecahan 3/5 dan 4/7 dengan tanda yang tepat!', 'jawaban' => '3/5 > 4/7', 'pembahasan' => 'Kali silang: 3 × 7 = 21, sedangkan 5 × 4 = 20. Karena 21 > 20, maka 3/5 > 4/7.'],
                ],
                'slides' => [
                    ['slideNo' => 1, 'judul' => 'Aturan Perbandingan Pecahan', 'konten' => 'Penyebut sama = lihat atas. Penyebut beda = kali silang.'],
                ],
            ],
            [
                'nomor' => 5,
                'judul' => 'Penjumlahan dan Pengurangan Pecahan',
                'durasi' => '4 JP (140 Menit)',
                'tujuan' => [
                    'Siswa dapat menjumlahkan dan mengurangkan pecahan dengan penyebut yang sama.',
                    'Siswa dapat menyelesaikan operasi hitung pecahan dengan penyebut berbeda melalui KPK.',
                ],
                'materi_utama' => "1. Penyebut Sama:\n1/5 + 2/5 = (1+2)/5 = 3/5\n4/7 - 1/7 = (4-1)/7 = 3/7\n\n2. Penyebut Berbeda:\n1/2 + 1/3 = ?\nKPK dari 2 dan 3 adalah 6.\n(1×3)/6 + (1×2)/6 = 3/6 + 2/6 = 5/6.",
                'ilustrasi' => ['tipe' => 'addition', 'label' => '1/2 + 1/3 = 3/6 + 2/6 = 5/6', 'caption' => 'Visualisasi menyamakan kisi petak penyebut menjadi 6 bagian.'],
                'video' => ['judul' => 'Langkah Mudah Penjumlahan & Pengurangan Pecahan Berpenyebut Beda', 'durasi' => '06:10', 'thumbnail' => 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600', 'deskripsiVideo' => 'Tutorial bertahap mencari KPK dan menjumlahkan pecahan.'],
                'contoh_soal' => [
                    ['soal' => 'Hitunglah hasil dari 2/3 + 1/4!', 'jawaban' => '11/12', 'pembahasan' => 'KPK dari 3 dan 4 adalah 12. (2×4)/12 + (1×3)/12 = 8/12 + 3/12 = 11/12.'],
                ],
                'slides' => [
                    ['slideNo' => 1, 'judul' => 'Operasi Pecahan Dasar', 'konten' => 'Syarat mutlak: Penyebut harus disamakan terlebih dahulu!'],
                ],
            ],
        ];

        // Submateri for MAT-001 (SD)
        foreach ($submateris as $sub) {
            Submateri::create(array_merge($sub, ['materi_id' => $mat1->id]));
        }

        // Quiz for MAT-001 (SD)
        $quiz1 = Quiz::create([
            'materi_id' => $mat1->id,
            'kode' => 'QZ-PEC-01',
            'judul' => 'Quiz Evaluasi: Pemahaman Dasar Pecahan',
            'topik' => 'Matematika Kelas 5A - Bab 2 Pecahan',
            'durasi_menit' => 10,
            'kkm' => 75,
            'deskripsi' => 'Uji pemahaman konsep pecahan biasa, desimal, campuran, dan operasi hitung.',
        ]);

        $soals1 = [
            ['nomor' => 1, 'pertanyaan' => 'Sebuah semangka dipotong menjadi 6 bagian sama besar. Dina memakan 2 potong. Bagian semangka yang dimakan Dina adalah...', 'opsi' => ['1/6 bagian', '2/6 (atau 1/3) bagian', '2/4 bagian', '4/6 bagian'], 'kunci' => 1, 'penjelasan' => 'Dina memakan 2 dari 6 potong total, jadi bernilai 2/6. Jika disederhanakan dibagi 2 menjadi 1/3.'],
            ['nomor' => 2, 'pertanyaan' => 'Bentuk pecahan desimal dari pecahan 3/4 adalah...', 'opsi' => ['0,34', '0,50', '0,75', '0,80'], 'kunci' => 2, 'penjelasan' => '3/4 = (3 × 25) / (4 × 25) = 75/100 = 0,75.'],
            ['nomor' => 3, 'pertanyaan' => 'Tanda perbandingan yang tepat untuk 3/5 ... 2/3 adalah...', 'opsi' => ['< (Lebih kecil)', '> (Lebih besar)', '= (Sama dengan)', '>= (Lebih besar atau sama)'], 'kunci' => 0, 'penjelasan' => 'Kali silang: 3 × 3 = 9, sedangkan 5 × 2 = 10. Karena 9 < 10, maka 3/5 < 2/3.'],
            ['nomor' => 4, 'pertanyaan' => 'Bentuk pecahan campuran dari 14/5 adalah...', 'opsi' => ['2 4/5', '3 1/5', '2 3/5', '1 4/5'], 'kunci' => 0, 'penjelasan' => '14 dibagi 5 menghasilkan 2 dengan sisa 4, maka bentuk campurannya adalah 2 4/5.'],
            ['nomor' => 5, 'pertanyaan' => 'Hasil dari penjumlahan 1/3 + 1/2 adalah...', 'opsi' => ['2/5', '5/6', '1/6', '2/6'], 'kunci' => 1, 'penjelasan' => 'KPK 3 dan 2 adalah 6. (1×2)/6 + (1×3)/6 = 2/6 + 3/6 = 5/6.'],
        ];

        foreach ($soals1 as $s) {
            QuizSoal::create(array_merge($s, ['quiz_id' => $quiz1->id]));
        }

        GameDataset::create([
            'materi_id' => $mat1->id,
            'tipe_game' => 'matching',
            'judul' => 'Matching Cards: Pecahan & Desimal',
            'data' => [
                ['id' => 1, 'pairId' => 'p1', 'value' => '1/2', 'type' => 'Pecahan Biasa'],
                ['id' => 2, 'pairId' => 'p1', 'value' => '0,50 (50%)', 'type' => 'Nilai Desimal'],
                ['id' => 3, 'pairId' => 'p2', 'value' => '1/4', 'type' => 'Pecahan Biasa'],
                ['id' => 4, 'pairId' => 'p2', 'value' => '0,25 (25%)', 'type' => 'Nilai Desimal'],
                ['id' => 5, 'pairId' => 'p3', 'value' => '3/4', 'type' => 'Pecahan Biasa'],
                ['id' => 6, 'pairId' => 'p3', 'value' => '0,75 (75%)', 'type' => 'Nilai Desimal'],
                ['id' => 7, 'pairId' => 'p4', 'value' => '1/5', 'type' => 'Pecahan Biasa'],
                ['id' => 8, 'pairId' => 'p4', 'value' => '0,20 (20%)', 'type' => 'Nilai Desimal'],
            ],
        ]);

        GameDataset::create([
            'materi_id' => $mat1->id,
            'tipe_game' => 'ordering',
            'judul' => 'Urutkan Nilai Pecahan',
            'data' => [
                ['id' => 'item-1', 'label' => '3/4', 'desimal' => '0,75', 'value' => 0.75],
                ['id' => 'item-2', 'label' => '1/4', 'desimal' => '0,25', 'value' => 0.25],
                ['id' => 'item-3', 'label' => '1/2', 'desimal' => '0,50', 'value' => 0.50],
                ['id' => 'item-4', 'label' => '1 (Utuh)', 'desimal' => '1,00', 'value' => 1.00],
            ],
        ]);

        // =========================================================================
        // SUBMATERI & QUIZ FOR MAT-002 (SMP: Algoritma Scratch)
        // =========================================================================
        $mat2 = Materi::where('kode', 'MAT-002')->first();
        if ($mat2) {
            $subMat2 = [
                [
                    'nomor' => 1,
                    'judul' => '4 Pilar Berpikir Komputasional',
                    'durasi' => '2 JP (80 Menit)',
                    'tujuan' => ['Memahami dekomposisi, pengenalan pola, abstraksi, dan perancangan algoritma.'],
                    'materi_utama' => "Berpikir komputasional adalah metode pemecahan masalah dengan menerapkan prinsip-prinsip ilmu komputer.\n\n4 Pilar Utama:\n1. Dekomposisi: Memecah masalah kompleks menjadi sub-masalah yang lebih kecil.\n2. Pengenalan Pola: Mengidentifikasi kesamaan antar masalah yang pernah dihadapi.\n3. Abstraksi: Fokus pada informasi penting dan mengabaikan detail yang tidak relevan.\n4. Algoritma: Menyusun langkah-langkah terurut logis untuk menyelesaikan solusi.",
                ],
                [
                    'nomor' => 2,
                    'judul' => 'Logika Algoritma & Flowchart',
                    'durasi' => '2 JP (80 Menit)',
                    'tujuan' => ['Membuat bagan alir simbol standar dan pseudocode percabangan.'],
                    'materi_utama' => "Flowchart menggunakan simbol baku:\n• Terminator (Oval): Mulai / Selesai\n• Proses (Persegi Panjang): Langkah eksekusi / kalkulasi\n• Keputusan (Belah Ketupat): Percabangan Ya / Tidak\n• Input/Output (Jajar Genjang): Masukan dan Luaran data.",
                ],
                [
                    'nomor' => 3,
                    'judul' => 'Implementasi Visual Coding Scratch',
                    'durasi' => '4 JP (160 Menit)',
                    'tujuan' => ['Membuat animasi interaktif dengan sprite, backdrop, loops, dan conditional.'],
                    'materi_utama' => "Pada Scratch, blok perintah disusun seperti puzzle:\n• Events: 'When green flag clicked' memicu program.\n• Motion: Memindahkan sprite sejauh langkah tertentu.\n• Control: Blok 'repeat', 'forever', dan 'if-then'.\n• Sensing: Mendeteksi sentuhan kursor atau tombol keyboard.",
                ],
            ];
            foreach ($subMat2 as $sub) {
                Submateri::create(array_merge($sub, ['materi_id' => $mat2->id]));
            }

            $quiz2 = Quiz::create([
                'materi_id' => $mat2->id,
                'kode' => 'QZ-CMP-01',
                'judul' => 'Quiz Berpikir Komputasional & Scratch',
                'topik' => 'Informatika SMP Kelas 7 - Bab 1',
                'durasi_menit' => 10,
                'kkm' => 75,
                'deskripsi' => 'Uji pemahaman pilar komputasional dan pemrograman blok visual.',
            ]);

            $soals2 = [
                ['nomor' => 1, 'pertanyaan' => 'Memecah masalah besar menjadi bagian-bagian kecil yang mudah dikelola disebut...', 'opsi' => ['Dekomposisi', 'Abstraksi', 'Pengenalan Pola', 'Algoritma'], 'kunci' => 0, 'penjelasan' => 'Dekomposisi adalah teknik memecah permasalahan menjadi komponen yang lebih sederhana.'],
                ['nomor' => 2, 'pertanyaan' => 'Simbol belah ketupat pada diagram alir (flowchart) melambangkan...', 'opsi' => ['Mulai/Selesai', 'Proses perhitungan', 'Keputusan / Percabangan', 'Input data'], 'kunci' => 2, 'penjelasan' => 'Belah ketupat digunakan untuk Decision (keputusan berkondisi Ya/Tidak).'],
                ['nomor' => 3, 'pertanyaan' => 'Blok perintah di Scratch yang digunakan untuk mengulang aksi tanpa batas adalah...', 'opsi' => ['repeat 10', 'forever', 'if then', 'wait 1 secs'], 'kunci' => 1, 'penjelasan' => 'Blok forever menjalankan blok di dalamnya terus menerus hingga program dihentikan.'],
            ];
            foreach ($soals2 as $s) {
                QuizSoal::create(array_merge($s, ['quiz_id' => $quiz2->id]));
            }

            GameDataset::create([
                'materi_id' => $mat2->id,
                'tipe_game' => 'matching',
                'judul' => 'Pilar Berpikir Komputasional',
                'data' => [
                    ['id' => 1, 'pairId' => 'p1', 'value' => 'Dekomposisi', 'type' => 'Pilar'],
                    ['id' => 2, 'pairId' => 'p1', 'value' => 'Memecah Masalah Kompleks', 'type' => 'Definisi'],
                    ['id' => 3, 'pairId' => 'p2', 'value' => 'Abstraksi', 'type' => 'Pilar'],
                    ['id' => 4, 'pairId' => 'p2', 'value' => 'Menyaring Hal Penting', 'type' => 'Definisi'],
                    ['id' => 5, 'pairId' => 'p3', 'value' => 'Algoritma', 'type' => 'Pilar'],
                    ['id' => 6, 'pairId' => 'p3', 'value' => 'Langkah Terurut Sistematis', 'type' => 'Definisi'],
                ],
            ]);
        }

        // =========================================================================
        // 4. SMK: MAT-004 — TEKNIK JARINGAN KOMPUTER & TELEKOMUNIKASI
        // =========================================================================
        $mat4 = Materi::create([
            'kode' => 'MAT-004',
            'jenjang' => 'SMK / Fase E',
            'kelas' => 'Kelas 10 SMK',
            'mapel' => 'Teknik Komputer & Jaringan',
            'topik' => 'Dasar Jaringan Komputer, Model OSI & Subnetting IPv4',
            'jumlah_submateri' => 3,
            'author' => 'Direktorat SMK Kemendikbudristek & Komite Vokasi Nasional',
            'tanggal_terbit' => '25 Agt 2026',
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => 'Pengenalan arsitektur TCP/IP, OSI 7 Layer, pengkabelan UTP standar TIA/EIA-568B, perhitungan subnet mask, network address, dan broadcast address.',
        ]);

        $subMat4 = [
            [
                'nomor' => 1,
                'judul' => 'Model Referensi OSI 7 Layer & TCP/IP',
                'durasi' => '4 JP (180 Menit)',
                'tujuan' => ['Memahami fungsi tiap layer OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application.'],
                'materi_utama' => "Model OSI (Open Systems Interconnection) membagi komunikasi jaringan menjadi 7 lapisan:\n1. Physical: Transmisi sinyal bit fisik (kabel tembaga, fiber optic, wireless).\n2. Data Link: Pengalamatan fisik (MAC Address) dan framing (Switch Layer 2).\n3. Network: Pengalamatan logis (IP Address) dan routing paket (Router).\n4. Transport: Pengiriman data andal (TCP) atau cepat (UDP) serta nomor port.\n5. Session: Manajemen koneksi antar sesi aplikasi.\n6. Presentation: Enkripsi, kompresi, dan format data (SSL/TLS, ASCII, JPEG).\n7. Application: Antarmuka langsung ke pengguna (HTTP, HTTPS, DNS, FTP).",
            ],
            [
                'nomor' => 2,
                'judul' => 'Pengalamatan IPv4 & Teknik Subnetting CIDR',
                'durasi' => '4 JP (180 Menit)',
                'tujuan' => ['Menghitung Network ID, Broadcast ID, Host Valid, dan Subnet Mask notasi CIDR /24 - /30.'],
                'materi_utama' => "Alamat IPv4 terdiri dari 32 bit yang dibagi menjadi 4 oktet (8 bit per oktet).\n\nRumus Dasar Subnetting:\n• Jumlah Subnet = 2^x (x = jumlah bit 1 pada host portion yang dipinjam)\n• Jumlah Host per Subnet = 2^y - 2 (y = sisa bit 0 pada host)\n\nContoh Prefix /26 (255.255.255.192):\n• Nilai bit akhir: 11000000 (128 + 64 = 192)\n• Blok subnet = 256 - 192 = 64\n• Subnet rentang: 0, 64, 128, 192\n• Host yang bisa digunakan per blok: 64 - 2 = 62 host.",
            ],
            [
                'nomor' => 3,
                'judul' => 'Konfigurasi Mikrotik RouterOS Dasar',
                'durasi' => '4 JP (180 Menit)',
                'tujuan' => ['Konfigurasi IP Address, DHCP Server, NAT Masquerade, dan DNS Server di Routerboard.'],
                'materi_utama' => "Langkah Praktik Dasar Router MikroTik:\n1. Akses Router via Winbox menggunakan MAC Address.\n2. Tambahkan IP Address pada ether1 (WAN) dan ether2 (LAN).\n3. Buat IP Pool dan aktifkan DHCP Server pada interface ether2.\n4. Konfigurasi IP Firewall NAT: chain=srcnat action=masquerade out-interface=ether1.\n5. Isi IP DNS Server Google (8.8.8.8) dan centang 'Allow Remote Requests'.",
            ],
        ];

        foreach ($subMat4 as $sub) {
            Submateri::create(array_merge($sub, ['materi_id' => $mat4->id]));
        }

        $quiz4 = Quiz::create([
            'materi_id' => $mat4->id,
            'kode' => 'QZ-TKJ-01',
            'judul' => 'Quiz Uji Kompetensi Dasar Jaringan & Subnetting',
            'topik' => 'TKJ SMK Kelas X - Praktik Jaringan Komputer',
            'durasi_menit' => 15,
            'kkm' => 78,
            'deskripsi' => 'Uji pemahaman konsep layer OSI, subnet mask, nomor port jaringan, dan konfigurasi IP.',
        ]);

        $soals4 = [
            ['nomor' => 1, 'pertanyaan' => 'Layer pada model OSI yang bertugas menentukan jalur terbaik (routing) dan menggunakan IP Address adalah...', 'opsi' => ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'], 'kunci' => 2, 'penjelasan' => 'Network Layer (Layer 3) bertanggung jawab atas routing logis dan paket data menggunakan IP.'],
            ['nomor' => 2, 'pertanyaan' => 'Jumlah host yang dapat digunakan (usable IP) pada subnet dengan prefix /29 adalah...', 'opsi' => ['6 host', '8 host', '14 host', '30 host'], 'kunci' => 0, 'penjelasan' => 'Prefix /29 menyisakan 3 bit host (32 - 29 = 3). Jumlah host = 2^3 - 2 = 8 - 2 = 6 host.'],
            ['nomor' => 3, 'pertanyaan' => 'Port standar yang digunakan untuk protokol web aman HTTPS adalah...', 'opsi' => ['Port 80', 'Port 21', 'Port 443', 'Port 22'], 'kunci' => 2, 'penjelasan' => 'HTTPS berjalan pada TCP Port 443, sedangkan HTTP menggunakan Port 80.'],
            ['nomor' => 4, 'pertanyaan' => 'Fitur MikroTik Firewall NAT yang berfungsi menerjemahkan IP private lokal ke IP publik internet adalah...', 'opsi' => ['Accept', 'Drop', 'Masquerade', 'Redirect'], 'kunci' => 2, 'penjelasan' => 'Action Masquerade menyamarkan alamat IP sumber lokal menjadi IP interface out WAN.'],
        ];

        foreach ($soals4 as $s) {
            QuizSoal::create(array_merge($s, ['quiz_id' => $quiz4->id]));
        }

        GameDataset::create([
            'materi_id' => $mat4->id,
            'tipe_game' => 'matching',
            'judul' => 'Matching Protokol Jaringan & Nomor Port',
            'data' => [
                ['id' => 1, 'pairId' => 'p1', 'value' => 'HTTP', 'type' => 'Protokol'],
                ['id' => 2, 'pairId' => 'p1', 'value' => 'Port 80', 'type' => 'Port'],
                ['id' => 3, 'pairId' => 'p2', 'value' => 'HTTPS', 'type' => 'Protokol'],
                ['id' => 4, 'pairId' => 'p2', 'value' => 'Port 443', 'type' => 'Port'],
                ['id' => 5, 'pairId' => 'p3', 'value' => 'SSH Remote', 'type' => 'Protokol'],
                ['id' => 6, 'pairId' => 'p3', 'value' => 'Port 22', 'type' => 'Port'],
                ['id' => 7, 'pairId' => 'p4', 'value' => 'DNS Query', 'type' => 'Protokol'],
                ['id' => 8, 'pairId' => 'p4', 'value' => 'Port 53', 'type' => 'Port'],
            ],
        ]);

        // =========================================================================
        // 5. SMK: MAT-005 — REKAYASA PERANGKAT LUNAK (RPL)
        // =========================================================================
        $mat5 = Materi::create([
            'kode' => 'MAT-005',
            'jenjang' => 'SMK / Fase F',
            'kelas' => 'Kelas 11 SMK',
            'mapel' => 'Rekayasa Perangkat Lunak',
            'topik' => 'Pemrograman Web Modern (React & RESTful API)',
            'jumlah_submateri' => 3,
            'author' => 'Direktorat SMK Kemendikbudristek & Asosiasi Industri Software',
            'tanggal_terbit' => '26 Agt 2026',
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => 'Pengembangan antarmuka single-page application (SPA), React hooks (useState, useEffect), konsumsi API endpoint JSON, dan arsitektur database relasional.',
        ]);

        $subMat5 = [
            [
                'nomor' => 1,
                'judul' => 'Komponen React & Pengelolaan State',
                'durasi' => '4 JP (180 Menit)',
                'tujuan' => ['Membuat functional components, memanipulasi JSX, dan menggunakan hook useState.'],
                'materi_utama' => "React adalah pustaka JavaScript deklaratif untuk membangun antarmuka pengguna berbasis komponen.\n\nKonsep Kunci:\n• Props: Data searah yang diteruskan dari komponen induk ke anak.\n• State: Data internal komponen yang dapat berubah dan memicu render ulang saat di-update.\n• JSX: Ekstensi sintaks JavaScript yang menyerupai HTML namun memiliki kapabilitas ekspresi kode JS penuh.",
            ],
            [
                'nomor' => 2,
                'judul' => 'Integrasi API dengan HTTP Client Fetch / Axios',
                'durasi' => '4 JP (180 Menit)',
                'tujuan' => ['Melakukan asynchronous request HTTP (GET, POST, PUT, DELETE) dengan Bearer Token autentikasi.'],
                'materi_utama' => "Mekanisme REST API Client:\n• GET: Mengambil data koleksi atau entitas tunggal.\n• POST: Mengirim payload JSON untuk membuat rekaman baru.\n• PUT/PATCH: Memperbarui data yang ada.\n• DELETE: Menghapus data.\n• Authorization Header: Mengirim Bearer <token> untuk melindungi endpoint terlindungi.",
            ],
            [
                'nomor' => 3,
                'judul' => 'Clean Code & Penanganan Error UI',
                'durasi' => '4 JP (180 Menit)',
                'tujuan' => ['Mengimplementasikan loading skeleton, feedback toast, dan pencegahan error state null.'],
                'materi_utama' => "Aplikasi web profesional wajib menangani kondisi loading, sukses, dan gagal secara visual.\nGunakan conditional rendering untuk menampilkan skeleton loader saat data sedang diambil, dan berikan feedback ramah saat koneksi gagal.",
            ],
        ];

        foreach ($subMat5 as $sub) {
            Submateri::create(array_merge($sub, ['materi_id' => $mat5->id]));
        }

        $quiz5 = Quiz::create([
            'materi_id' => $mat5->id,
            'kode' => 'QZ-RPL-01',
            'judul' => 'Quiz Pemrograman Web Modern & API',
            'topik' => 'RPL SMK Kelas XI - Web & Mobile Dev',
            'durasi_menit' => 15,
            'kkm' => 80,
            'deskripsi' => 'Uji pemahaman seputar React hooks, asynchronous JavaScript, HTTP method, dan JSON API.',
        ]);

        $soals5 = [
            ['nomor' => 1, 'pertanyaan' => 'Hook standar React yang digunakan untuk menangani side-effects seperti fetch API adalah...', 'opsi' => ['useState', 'useEffect', 'useMemo', 'useRef'], 'kunci' => 1, 'penjelasan' => 'useEffect dirancang untuk side effects seperti fetching data, manipulasi DOM, atau timer.'],
            ['nomor' => 2, 'pertanyaan' => 'Metode HTTP yang tepat digunakan untuk memperbarui sebagian data spesifik adalah...', 'opsi' => ['GET', 'POST', 'PUT/PATCH', 'DELETE'], 'kunci' => 2, 'penjelasan' => 'PUT atau PATCH digunakan untuk update data resource.'],
            ['nomor' => 3, 'pertanyaan' => 'Format pertukaran data standar yang paling sering digunakan pada komunikasi REST API modern adalah...', 'opsi' => ['XML', 'JSON', 'CSV', 'YAML'], 'kunci' => 1, 'penjelasan' => 'JSON (JavaScript Object Notation) adalah format ringan dan universal untuk REST API.'],
        ];

        foreach ($soals5 as $s) {
            QuizSoal::create(array_merge($s, ['quiz_id' => $quiz5->id]));
        }

        // =========================================================================
        // 6. SMA: MAT-006 — BIOLOGI KELAS 10 SMA
        // =========================================================================
        $mat6 = Materi::create([
            'kode' => 'MAT-006',
            'jenjang' => 'SMA / Fase E',
            'kelas' => 'Kelas 10 SMA',
            'mapel' => 'Biologi & Sains Terapan',
            'topik' => 'Keanekaragaman Hayati & Ekosistem Tropis',
            'jumlah_submateri' => 2,
            'author' => 'Direktorat SMA Kemendikbudristek',
            'tanggal_terbit' => '27 Agt 2026',
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => 'Karakteristik keanekaragaman hayati gen, jenis, ekosistem di wilayah biogeografi Oriental, Australian, dan Peralihan (Wallacea).',
        ]);

        $subMat6 = [
            [
                'nomor' => 1,
                'judul' => 'Tingkatan Biodiversitas & Garis Wallace-Weber',
                'durasi' => '3 JP (135 Menit)',
                'tujuan' => ['Membedakan variasi genetik, spesies, dan ekosistem serta peta persebaran fauna Indonesia.'],
                'materi_utama' => "Indonesia memiliki kekayaan mega-biodiversitas yang dibagi oleh:\n• Garis Wallace: Membatasi tipe Asiatis (Gajah, Harimau, Badak) dengan tipe Peralihan.\n• Garis Weber: Membatasi tipe Peralihan (Komodo, Anoa, Babirusa) dengan tipe Australis (Cenderawasih, Kanguru Pohon).",
            ],
            [
                'nomor' => 2,
                'judul' => 'Konservasi In-Situ & Ex-Situ',
                'durasi' => '3 JP (135 Menit)',
                'tujuan' => ['Menganalisis pelestarian habitat asli versus penangkaran luar habitat.'],
                'materi_utama' => "Metode Pelestarian Flora & Fauna:\n1. In-Situ: Dilakukan di habitat aslinya (Taman Nasional Ujung Kulon, Cagar Alam Komodo).\n2. Ex-Situ: Dilakukan di luar habitat aslinya untuk rehabilitasi (Kebun Raya Bogor, Taman Safari).",
            ],
        ];

        foreach ($subMat6 as $sub) {
            Submateri::create(array_merge($sub, ['materi_id' => $mat6->id]));
        }

        $quiz6 = Quiz::create([
            'materi_id' => $mat6->id,
            'kode' => 'QZ-BIO-01',
            'judul' => 'Quiz Keanekaragaman Hayati Indonesia',
            'topik' => 'Biologi SMA Kelas X - Bab 2 Ekosistem',
            'durasi_menit' => 10,
            'kkm' => 75,
            'deskripsi' => 'Uji pemahaman zona persebaran flora fauna dan upaya konservasi lingkungan.',
        ]);

        $soals6 = [
            ['nomor' => 1, 'pertanyaan' => 'Fauna khas zona peralihan di kawasan Wallacea Indonesia adalah...', 'opsi' => ['Harimau Sumatera', 'Komodo dan Anoa', 'Cenderawasih', 'Badak Bercula Satu'], 'kunci' => 1, 'penjelasan' => 'Komodo dan Anoa adalah satwa endemik pulau Sulawesi dan Nusa Tenggara pada zona peralihan.'],
            ['nomor' => 2, 'pertanyaan' => 'Pelestarian spesies langka di habitat aslinya seperti Taman Nasional disebut konservasi...', 'opsi' => ['In-situ', 'Ex-situ', 'Reboisasi', 'Domestikasi'], 'kunci' => 0, 'penjelasan' => 'Konservasi in-situ dilakukan di habitat asli satwa/tumbuhan.'],
        ];

        foreach ($soals6 as $s) {
            QuizSoal::create(array_merge($s, ['quiz_id' => $quiz6->id]));
        }
    }
}

