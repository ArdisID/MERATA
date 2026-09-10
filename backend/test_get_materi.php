<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Http\Request;

$user = User::where('role', 'pemerintah')->first();
$token = $user->createToken('test3')->plainTextToken;

$request = Request::create('/api/pemerintah/materi', 'GET');
$request->headers->set('Authorization', 'Bearer ' . $token);
$request->headers->set('Accept', 'application/json');

$response = $app->handle($request);
echo "Status: " . $response->getStatusCode() . PHP_EOL;
$data = json_decode($response->getContent(), true);
echo "Total items: " . count($data) . PHP_EOL;
foreach ($data as $m) {
    echo "ID: {$m['id']} | Kode: {$m['kode']} | Topik: {$m['topik']} | Submateris count: " . count($m['submateris'] ?? []) . PHP_EOL;
    foreach ($m['submateris'] ?? [] as $sub) {
        echo "   -> #{$sub['nomor']}: {$sub['judul']}" . PHP_EOL;
    }
}
