<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== ADMIN USERS ===" . PHP_EOL;
$admins = App\Models\User::where('role', 'admin')->get();
foreach ($admins as $a) {
    $schName = $a->sekolah ? $a->sekolah->nama : ($a->guru?->sekolah?->nama ?? 'NONE');
    echo "ID: {$a->id} | Name: {$a->name} | Email: {$a->email} | Sekolah ID: {$a->sekolah_id} | Sekolah: {$schName}" . PHP_EOL;
}

echo PHP_EOL . "=== SAMPLE GURU USERS ===" . PHP_EOL;
$gurus = App\Models\User::where('role', 'guru')->take(8)->get();
foreach ($gurus as $g) {
    $guruRecord = $g->guru;
    $schName = $g->sekolah ? $g->sekolah->nama : ($guruRecord?->sekolah?->nama ?? 'NONE');
    $guruNama = $guruRecord ? $guruRecord->nama : 'NO GURU RECORD';
    echo "ID: {$g->id} | User Name: {$g->name} | Email: {$g->email} | Guru: {$guruNama} | Sekolah: {$schName}" . PHP_EOL;
}
