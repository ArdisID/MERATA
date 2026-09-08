<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GuruController;
use App\Http\Controllers\Api\KebutuhanController;
use App\Http\Controllers\Api\PemerintahController;
use App\Http\Controllers\Api\PresensiController;
use App\Http\Controllers\Api\SekolahController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| MERATA API Routes
|--------------------------------------------------------------------------
| Platform Pemerataan Pendidikan — REST API
| Auth: Laravel Sanctum (Bearer Token)
|--------------------------------------------------------------------------
*/

// ==================== PUBLIC ROUTES ====================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// ==================== AUTHENTICATED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me']);

    // File Upload
    Route::post('/upload', [UploadController::class, 'upload']);

    // ==================== GURU ROUTES ====================
    Route::middleware('role:guru')->prefix('guru')->group(function () {
        Route::get('/dashboard', [GuruController::class, 'dashboard']);

        // Kelas & Pembelajaran
        Route::get('/kelas', [GuruController::class, 'kelasList']);
        Route::get('/kelas/{id}', [GuruController::class, 'kelasDetail']);
        Route::get('/kelas/{kelasKode}/materi', [GuruController::class, 'kelasMateri']);
        Route::get('/kelas/{kelasKode}/quiz', [GuruController::class, 'kelasQuiz']);
        Route::get('/kelas/{kelasKode}/game', [GuruController::class, 'kelasGame']);

        // Presensi
        Route::post('/kelas/{kelasId}/presensi', [PresensiController::class, 'store']);
        Route::get('/kelas/{kelasId}/presensi', [PresensiController::class, 'show']);

        // Monitoring Siswa
        Route::get('/monitoring', [GuruController::class, 'monitoring']);
        Route::put('/siswa/{id}', [GuruController::class, 'updateSiswa']);

        // Profil & Kebutuhan
        Route::get('/profil', [GuruController::class, 'profil']);
        Route::post('/kebutuhan', [GuruController::class, 'storeKebutuhan']);
        Route::put('/kebutuhan/{id}', [GuruController::class, 'updateKebutuhan']);
        Route::delete('/kebutuhan/{id}', [GuruController::class, 'deleteKebutuhan']);
    });

    // ==================== ADMIN ROUTES ====================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        // Data Sekolah
        Route::get('/siswa', [AdminController::class, 'siswaList']);
        Route::post('/siswa', [AdminController::class, 'storeSiswa']);
        Route::put('/siswa/{id}', [AdminController::class, 'updateSiswa']);
        Route::delete('/siswa/{id}', [AdminController::class, 'deleteSiswa']);
        Route::get('/guru', [AdminController::class, 'guruList']);
        Route::post('/guru', [AdminController::class, 'storeGuru']);
        Route::put('/guru/{id}', [AdminController::class, 'updateGuru']);
        Route::delete('/guru/{id}', [AdminController::class, 'deleteGuru']);
        Route::get('/kelas', [AdminController::class, 'kelasList']);
        Route::get('/fasilitas', [AdminController::class, 'fasilitasList']);
        Route::post('/fasilitas', [AdminController::class, 'storeFasilitas']);
        Route::put('/fasilitas/{id}', [AdminController::class, 'updateFasilitas']);
        Route::delete('/fasilitas/{id}', [AdminController::class, 'deleteFasilitas']);

        // Kebutuhan & Bantuan
        Route::get('/verifikasi', [KebutuhanController::class, 'verifikasiList']);
        Route::put('/verifikasi/{id}', [KebutuhanController::class, 'updateVerifikasi']);
        Route::get('/bantuan', [KebutuhanController::class, 'bantuanList']);

        // Profil Sekolah
        Route::get('/profil-sekolah', [SekolahController::class, 'show']);
        Route::put('/profil-sekolah', [SekolahController::class, 'update']);
    });

    // ==================== PEMERINTAH ROUTES ====================
    Route::middleware('role:pemerintah')->prefix('pemerintah')->group(function () {
        Route::get('/dashboard', [PemerintahController::class, 'dashboard']);

        // Monitoring
        Route::get('/sekolah', [PemerintahController::class, 'sekolahList']);
        Route::get('/sekolah/{id}', [PemerintahController::class, 'sekolahDetail']);
        Route::get('/siswa', [PemerintahController::class, 'siswaList']);
        Route::get('/guru', [PemerintahController::class, 'guruList']);
        Route::get('/kelas', [PemerintahController::class, 'kelasList']);
        Route::get('/fasilitas', [PemerintahController::class, 'fasilitasList']);

        // Bank Materi
        Route::get('/materi', [PemerintahController::class, 'materiList']);
        Route::post('/materi', [PemerintahController::class, 'storeMateri']);

        // Kebutuhan & Bantuan
        Route::get('/kebutuhan', [PemerintahController::class, 'kebutuhanList']);
        Route::put('/kebutuhan/{id}/approve', [PemerintahController::class, 'approveKebutuhan']);
        Route::put('/kebutuhan/{id}/reject', [PemerintahController::class, 'rejectKebutuhan']);

        // Laporan & Profil
        Route::get('/laporan', [PemerintahController::class, 'laporanList']);
        Route::get('/profil', [PemerintahController::class, 'profil']);
    });
});
