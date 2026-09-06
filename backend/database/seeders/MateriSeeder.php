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

        foreach ($submateris as $sub) {
            Submateri::create(array_merge($sub, ['materi_id' => $mat1->id]));
        }

        // From mockGuruData.js → mockQuizData
        $quiz = Quiz::create([
            'materi_id' => $mat1->id,
            'kode' => 'QZ-PEC-01',
            'judul' => 'Quiz Evaluasi: Pemahaman Dasar Pecahan',
            'topik' => 'Matematika Kelas 5A - Bab 2 Pecahan',
            'durasi_menit' => 10,
            'kkm' => 75,
            'deskripsi' => 'Uji pemahaman konsep pecahan biasa, desimal, campuran, dan operasi hitung.',
        ]);

        $soals = [
            ['nomor' => 1, 'pertanyaan' => 'Sebuah semangka dipotong menjadi 6 bagian sama besar. Dina memakan 2 potong. Bagian semangka yang dimakan Dina adalah...', 'opsi' => ['1/6 bagian', '2/6 (atau 1/3) bagian', '2/4 bagian', '4/6 bagian'], 'kunci' => 1, 'penjelasan' => 'Dina memakan 2 dari 6 potong total, jadi bernilai 2/6. Jika disederhanakan dibagi 2 menjadi 1/3.'],
            ['nomor' => 2, 'pertanyaan' => 'Bentuk pecahan desimal dari pecahan 3/4 adalah...', 'opsi' => ['0,34', '0,50', '0,75', '0,80'], 'kunci' => 2, 'penjelasan' => '3/4 = (3 × 25) / (4 × 25) = 75/100 = 0,75.'],
            ['nomor' => 3, 'pertanyaan' => 'Tanda perbandingan yang tepat untuk 3/5 ... 2/3 adalah...', 'opsi' => ['< (Lebih kecil)', '> (Lebih besar)', '= (Sama dengan)', '>= (Lebih besar atau sama)'], 'kunci' => 0, 'penjelasan' => 'Kali silang: 3 × 3 = 9, sedangkan 5 × 2 = 10. Karena 9 < 10, maka 3/5 < 2/3.'],
            ['nomor' => 4, 'pertanyaan' => 'Bentuk pecahan campuran dari 14/5 adalah...', 'opsi' => ['2 4/5', '3 1/5', '2 3/5', '1 4/5'], 'kunci' => 0, 'penjelasan' => '14 dibagi 5 menghasilkan 2 dengan sisa 4, maka bentuk campurannya adalah 2 4/5.'],
            ['nomor' => 5, 'pertanyaan' => 'Hasil dari penjumlahan 1/3 + 1/2 adalah...', 'opsi' => ['2/5', '5/6', '1/6', '2/6'], 'kunci' => 1, 'penjelasan' => 'KPK 3 dan 2 adalah 6. (1×2)/6 + (1×3)/6 = 2/6 + 3/6 = 5/6.'],
        ];

        foreach ($soals as $s) {
            QuizSoal::create(array_merge($s, ['quiz_id' => $quiz->id]));
        }

        // From mockGuruData.js → initialMatchingCards & orderingGameInitial
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
    }
}
