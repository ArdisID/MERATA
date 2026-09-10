<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Materi;

foreach (Materi::with('submateris')->get() as $m) {
    echo $m->id . ' | ' . $m->kode . ' | ' . $m->topik . ' | count=' . $m->submateris->count() . PHP_EOL;
    foreach ($m->submateris as $s) {
        echo '   - #' . $s->nomor . ' ' . $s->judul . PHP_EOL;
    }
}
