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
            'presensi.*.siswa_id' => 'required|integer',
            'presensi.*.status' => 'required|in:hadir,izin,sakit,alpa,H,I,S,A',
        ]);

        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        if (!$sekolahId) {
            $sekolahId = \App\Models\Sekolah::value('id');
        }

        $results = [];
        foreach ($request->presensi as $item) {
            // Cek dulu sekolahnya! Siswa harus terdaftar di sekolah ini!
            $siswa = Siswa::where('sekolah_id', $sekolahId)->find($item['siswa_id']);
            if (!$siswa) {
                continue;
            }

            $st = strtolower($item['status']);
            if ($st === 'hadir' || $st === 'h') {
                $newKehadiran = min(100, $siswa->kehadiran + 0.5);
            } else {
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
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        if (!$sekolahId) {
            $sekolahId = \App\Models\Sekolah::value('id');
        }

        // 1. CEK DULU SEKOLAHNYA: Pastikan kelas ini milik sekolah tersebut
        $kelas = \App\Models\Kelas::where('sekolah_id', $sekolahId)
            ->where(function ($q) use ($kelasId) {
                $q->where('id', $kelasId)
                  ->orWhere('kode', $kelasId)
                  ->orWhere('nama', $kelasId);
            })->first();

        // 2. Query siswa dengan filter sekolah_id dulu, baru kelas
        $query = Siswa::where('sekolah_id', $sekolahId);
        if ($kelas) {
            $query->where(function ($q) use ($kelas) {
                $q->where('kelas_id', $kelas->id)
                  ->orWhere('kelas_nama', $kelas->nama);
            });
        } else {
            $query->where('kelas_nama', $kelasId);
        }

        $siswas = $query->orderBy('nama')->get();

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
