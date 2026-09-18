<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$all = App\Models\Kebutuhan::all(['id','sekolah_id','guru_id','judul','tipe','status'])->toArray();
echo json_encode($all, JSON_PRETTY_PRINT);
