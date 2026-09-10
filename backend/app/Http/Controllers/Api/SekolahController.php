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
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));
        $sekolah = Sekolah::find($sekolahId);

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
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));
        $sekolah = Sekolah::find($sekolahId);

        if (!$sekolah) {
            return response()->json(['message' => 'Data sekolah tidak ditemukan.'], 404);
        }

        $sekolah->update($request->only([
            'nama', 'npsn', 'akreditasi', 'status_sekolah', 'jenjang',
            'kepala_sekolah', 'nip_kepsek', 'operator', 'alamat', 'wilayah',
            'kode_pos', 'telepon', 'email', 'website', 'kurikulum', 'foto',
        ]));

        return response()->json([
            'message' => 'Profil sekolah berhasil diperbarui.',
            'sekolah' => $sekolah->fresh(),
        ]);
    }
}
