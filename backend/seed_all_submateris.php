<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Materi;
use App\Models\Submateri;

echo "=== SEEDING SUBMATERIS FOR MAT-002 & MAT-003 ===" . PHP_EOL;

// 1. MAT-002
$m2 = Materi::where('kode', 'MAT-002')->first();
if ($m2) {
    $m2->submateris()->delete();
    $subs2 = [
        [
            'nomor' => 1,
            'judul' => 'Pengenalan 4 Pilar Berpikir Komputasional',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma dalam pemecahan masalah sehari-hari.',
        ],
        [
            'nomor' => 2,
            'judul' => 'Dekomposisi & Pengenalan Pola Masalah',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Memecah masalah kompleks menjadi bagian-bagian kecil yang dapat dikelola dan mencari kesamaan pola antar data.',
        ],
        [
            'nomor' => 3,
            'judul' => 'Logika Percabangan (If-Else) & Perulangan (Loop)',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Membuat alur keputusan kondisional dan perulangan perintah menggunakan flowchart dan pseudocode.',
        ],
        [
            'nomor' => 4,
            'judul' => 'Implementasi Coding Visual Blok (Scratch)',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Praktik membuat animasi dan game interaktif sederhana dengan menyusun blok kode visual Scratch.',
        ],
    ];

    foreach ($subs2 as $s) {
        Submateri::create(array_merge($s, ['materi_id' => $m2->id]));
    }
    $m2->update(['jumlah_submateri' => 4]);
    echo "Added 4 submateris to MAT-002" . PHP_EOL;
}

// 2. MAT-003
$m3 = Materi::where('kode', 'MAT-003')->first();
if ($m3) {
    $m3->submateris()->delete();
    $subs3 = [
        [
            'nomor' => 1,
            'judul' => 'Mengenal Variabel, Koefisien, dan Konstanta',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Definisi unsur-unsur bentuk aljabar dan suku sejenis versus suku tidak sejenis.',
        ],
        [
            'nomor' => 2,
            'judul' => 'Operasi Penjumlahan & Pengurangan Aljabar',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Menyederhanakan suku-suku sejenis dalam bentuk aljabar linear dua atau tiga suku.',
        ],
        [
            'nomor' => 3,
            'judul' => 'Perkalian dan Pembagian Bentuk Aljabar',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Distribusi perkalian suku tunggal dan suku dua, serta faktorisasi sederhana aljabar.',
        ],
        [
            'nomor' => 4,
            'judul' => 'Penyelesaian Persamaan Linear Satu Variabel (PLSV)',
            'durasi' => '2 JP (70 Menit)',
            'materi_utama' => 'Mencari nilai variabel pembuat benar menggunakan sifat kesetaraan operasi kedua ruas.',
        ],
    ];

    foreach ($subs3 as $s) {
        Submateri::create(array_merge($s, ['materi_id' => $m3->id]));
    }
    $m3->update(['jumlah_submateri' => 4]);
    echo "Added 4 submateris to MAT-003" . PHP_EOL;
}

echo "=== CURRENT DATABASE STATS ===" . PHP_EOL;
foreach (Materi::with('submateris')->get() as $m) {
    echo $m->kode . ' | ' . $m->topik . ' | ' . $m->submateris->count() . ' Submateri' . PHP_EOL;
}
