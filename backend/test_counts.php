<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Sekolah: " . \App\Models\Sekolah::count() . PHP_EOL;
echo "Siswa: " . \App\Models\Siswa::count() . PHP_EOL;
echo "Guru: " . \App\Models\Guru::count() . PHP_EOL;
echo "Kelas: " . \App\Models\Kelas::count() . PHP_EOL;
echo "Fasilitas: " . \App\Models\Fasilitas::count() . PHP_EOL;
echo "Users: " . \App\Models\User::count() . PHP_EOL;

foreach (\App\Models\Sekolah::all(['id', 'nama', 'npsn', 'wilayah']) as $s) {
    $sc = \App\Models\Siswa::where('sekolah_id', $s->id)->count();
    $gc = \App\Models\Guru::where('sekolah_id', $s->id)->count();
    echo "- [ID: {$s->id}] {$s->nama} ({$s->wilayah}) | Siswa: {$sc}, Guru: {$gc}" . PHP_EOL;
}
