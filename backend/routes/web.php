<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-db', function () {
    $schools = \App\Models\Sekolah::all();
    $users = \App\Models\User::with('guru')->get();
    $siswaPerSekolah = \App\Models\Siswa::select('sekolah_id', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
        ->groupBy('sekolah_id')
        ->get();
    $guruPerSekolah = \App\Models\Guru::select('sekolah_id', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
        ->groupBy('sekolah_id')
        ->get();

    return response()->json([
        'total_sekolah' => $schools->count(),
        'sekolahs' => $schools->map(fn($s) => ['id' => $s->id, 'nama' => $s->nama, 'wilayah' => $s->wilayah, 'npsn' => $s->npsn]),
        'total_siswa' => \App\Models\Siswa::count(),
        'siswa_per_sekolah' => $siswaPerSekolah,
        'total_guru' => \App\Models\Guru::count(),
        'guru_per_sekolah' => $guruPerSekolah,
        'users' => $users->map(fn($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'guru' => $u->guru ? ['id' => $u->guru->id, 'sekolah_id' => $u->guru->sekolah_id] : null,
        ]),
    ]);
});

