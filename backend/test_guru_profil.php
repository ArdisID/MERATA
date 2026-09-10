<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'intangusumawardhani.sch2@merata.sch.id')->first();
$guru = $user->guru;
$guru->load('sekolah');
echo json_encode([
    'profil' => $guru,
    'sekolah' => $guru->sekolah?->nama
], JSON_PRETTY_PRINT) . PHP_EOL;
