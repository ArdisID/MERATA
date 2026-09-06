<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;

class PresensiController extends Controller
{
    /**
     * Record daily attendance for a class.
     * POST /api/guru/kelas/{kelasId}/presensi
     */
    public function store(Request $request, $kelasId)
    {
        $request->validate([
            'presensi' => 'required|array',
            'presensi.*.siswa_id' => 'required|integer|exists:siswas,id',
            'presensi.*.status' => 'required|in:hadir,izin,sakit,alpa',
        ]);

        $results = [];
        foreach ($request->presensi as $item) {
            $siswa = Siswa::findOrFail($item['siswa_id']);

            // Simple attendance update: increment/decrement based on status
            if ($item['status'] === 'hadir') {
                // Slightly increase attendance percentage
                $newKehadiran = min(100, $siswa->kehadiran + 0.5);
            } else {
                // Slightly decrease attendance percentage
                $newKehadiran = max(0, $siswa->kehadiran - 0.5);
            }

            $statusKehadiran = $newKehadiran >= 90 ? 'Baik' : 'Perhatian Khusus';

            $siswa->update([
                'kehadiran' => $newKehadiran,
                'status_kehadiran' => $statusKehadiran,
            ]);

            $results[] = $siswa->fresh();
        }

        return response()->json([
            'message' => 'Presensi berhasil dicatat.',
            'updated_students' => $results,
        ]);
    }

    /**
     * Get attendance summary for a class.
     * GET /api/guru/kelas/{kelasId}/presensi
     */
    public function show(Request $request, $kelasId)
    {
        $siswas = Siswa::where('kelas_id', $kelasId)->get();

        $total = $siswas->count();
        $rataKehadiran = $total > 0 ? round($siswas->avg('kehadiran'), 1) : 0;
        $hadir = $siswas->where('kehadiran', '>=', 90)->count();
        $perhatian = $siswas->where('status_kehadiran', 'Perhatian Khusus')->count();

        return response()->json([
            'total_siswa' => $total,
            'rata_kehadiran' => $rataKehadiran . '%',
            'hadir_baik' => $hadir,
            'perlu_perhatian' => $perhatian,
            'siswas' => $siswas,
        ]);
    }
}
