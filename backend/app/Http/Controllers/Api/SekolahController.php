<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use Illuminate\Http\Request;

class SekolahController extends Controller
{
    /**
     * Get school profile.
     * GET /api/admin/profil-sekolah
     */
    public function show(Request $request)
    {
        $sekolah = Sekolah::first();

        if (!$sekolah) {
            return response()->json(['message' => 'Data sekolah tidak ditemukan.'], 404);
        }

        return response()->json($sekolah);
    }

    /**
     * Update school profile.
     * PUT /api/admin/profil-sekolah
     */
    public function update(Request $request)
    {
        $sekolah = Sekolah::first();

        if (!$sekolah) {
            return response()->json(['message' => 'Data sekolah tidak ditemukan.'], 404);
        }

        $sekolah->update($request->only([
            'nama', 'npsn', 'akreditasi', 'status_sekolah', 'jenjang',
            'kepala_sekolah', 'nip_kepsek', 'operator', 'alamat', 'wilayah',
            'kode_pos', 'telepon', 'email', 'website', 'kurikulum',
        ]));

        return response()->json([
            'message' => 'Profil sekolah berhasil diperbarui.',
            'sekolah' => $sekolah->fresh(),
        ]);
    }
}
