<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kebutuhan;
use App\Models\Kelas;
use App\Models\Materi;
use App\Models\Siswa;
use Illuminate\Http\Request;

class GuruController extends Controller
{
    /**
     * Dashboard stats for the logged-in teacher.
     * GET /api/guru/dashboard
     */
    public function dashboard(Request $request)
    {
        $guru = $request->user()->guru;

        if (!$guru) {
            return response()->json(['message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $kelasAjar = $guru->kelas_ajar ?? [];
        $kelasList = Kelas::whereIn('kode', array_map(fn($k) => 'KLS-' . $k, $kelasAjar))
            ->withCount('siswas')
            ->get();

        $totalSiswa = $kelasList->sum('siswas_count');
        $siswas = Siswa::whereIn('kelas_nama', $kelasAjar)->get();
        $kehadiranRata = $siswas->count() > 0 ? round($siswas->avg('kehadiran'), 1) : 0;
        $perluPerhatian = $siswas->where('status_kehadiran', 'Perhatian Khusus')->count();

        $kebutuhan = Kebutuhan::where('guru_id', $guru->id)->get();

        return response()->json([
            'guru' => $guru,
            'kelas_diajar' => $kelasList->count(),
            'total_siswa' => $totalSiswa,
            'kehadiran_rata' => $kehadiranRata . '%',
            'siswa_perlu_perhatian' => $perluPerhatian,
            'kebutuhan_menunggu' => $kebutuhan->where('status', 'menunggu')->count(),
            'kebutuhan_total' => $kebutuhan->count(),
        ]);
    }

    /**
     * List classes taught by the teacher.
     * GET /api/guru/kelas
     */
    public function kelasList(Request $request)
    {
        $guru = $request->user()->guru;
        if (!$guru) {
            return response()->json(['message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $kelasAjar = $guru->kelas_ajar ?? [];
        $kelasList = Kelas::whereIn('kode', array_map(fn($k) => 'KLS-' . $k, $kelasAjar))
            ->with('jadwals')
            ->get();

        return response()->json($kelasList);
    }

    /**
     * Detail of a specific class with students.
     * GET /api/guru/kelas/{id}
     */
    public function kelasDetail(Request $request, $id)
    {
        $kelas = Kelas::with(['siswas', 'jadwals'])->findOrFail($id);

        return response()->json($kelas);
    }

    /**
     * Get materials for a class.
     * GET /api/guru/kelas/{kelasKode}/materi
     */
    public function kelasMateri(Request $request, string $kelasKode)
    {
        // Find materials matching the class level
        $kelas = Kelas::where('kode', $kelasKode)->first();

        if (!$kelas) {
            return response()->json(['message' => 'Kelas tidak ditemukan.'], 404);
        }

        $materis = Materi::with(['submateris', 'quizzes.soals', 'gameDatasets'])
            ->where('kelas', 'like', '%' . $kelas->tingkat . '%')
            ->get();

        return response()->json($materis);
    }

    /**
     * Get quiz data for a class.
     * GET /api/guru/kelas/{kelasKode}/quiz
     */
    public function kelasQuiz(Request $request, string $kelasKode)
    {
        $kelas = Kelas::where('kode', $kelasKode)->first();
        if (!$kelas) {
            return response()->json(['message' => 'Kelas tidak ditemukan.'], 404);
        }

        $materis = Materi::where('kelas', 'like', '%' . $kelas->tingkat . '%')->pluck('id');
        $quizzes = \App\Models\Quiz::with('soals')
            ->whereIn('materi_id', $materis)
            ->get();

        return response()->json($quizzes);
    }

    /**
     * Get game datasets for a class.
     * GET /api/guru/kelas/{kelasKode}/game
     */
    public function kelasGame(Request $request, string $kelasKode)
    {
        $kelas = Kelas::where('kode', $kelasKode)->first();
        if (!$kelas) {
            return response()->json(['message' => 'Kelas tidak ditemukan.'], 404);
        }

        $materis = Materi::where('kelas', 'like', '%' . $kelas->tingkat . '%')->pluck('id');
        $games = \App\Models\GameDataset::whereIn('materi_id', $materis)->get();

        return response()->json($games);
    }

    /**
     * List students for monitoring.
     * GET /api/guru/monitoring
     */
    public function monitoring(Request $request)
    {
        $guru = $request->user()->guru;
        if (!$guru) {
            return response()->json(['message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $kelasAjar = $guru->kelas_ajar ?? [];
        $siswas = Siswa::whereIn('kelas_nama', $kelasAjar)
            ->orderBy('nama')
            ->get();

        $totalSiswa = $siswas->count();
        $kehadiranRata = $totalSiswa > 0 ? round($siswas->avg('kehadiran'), 1) : 0;
        $perluPerhatian = $siswas->where('status_kehadiran', 'Perhatian Khusus')->count();
        $nilaiRata = $totalSiswa > 0 ? round($siswas->avg('nilai_rata_rata'), 1) : 0;

        return response()->json([
            'stats' => [
                'total_siswa' => $totalSiswa,
                'kehadiran_rata' => $kehadiranRata . '%',
                'perlu_perhatian' => $perluPerhatian,
                'nilai_rata' => $nilaiRata,
            ],
            'siswas' => $siswas,
        ]);
    }

    /**
     * Update a student's monitoring data.
     * PUT /api/guru/siswa/{id}
     */
    public function updateSiswa(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $siswa->update($request->only([
            'kehadiran', 'status_kehadiran', 'nilai_rata_rata',
            'catatan', 'kebutuhan', 'status_bantuan',
        ]));

        return response()->json([
            'message' => 'Data siswa berhasil diperbarui.',
            'siswa' => $siswa->fresh(),
        ]);
    }

    /**
     * Get teacher profile and needs.
     * GET /api/guru/profil
     */
    public function profil(Request $request)
    {
        $guru = $request->user()->guru;
        if (!$guru) {
            return response()->json(['message' => 'Profil guru tidak ditemukan.'], 404);
        }

        $kebutuhan = Kebutuhan::where('guru_id', $guru->id)
            ->where('tipe', 'kebutuhan_guru')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'profil' => $guru,
            'kebutuhan' => $kebutuhan,
        ]);
    }

    /**
     * Submit a new need from guru.
     * POST /api/guru/kebutuhan
     */
    public function storeKebutuhan(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'estimasi_biaya' => 'nullable|string',
            'justifikasi' => 'nullable|string',
        ]);

        $guru = $request->user()->guru;
        if (!$guru) {
            return response()->json(['message' => 'Profil guru tidak ditemukan.'], 404);
        }

        // Create teacher's own tracking record
        $kebutuhanGuru = Kebutuhan::create([
            'sekolah_id' => $guru->sekolah_id,
            'guru_id' => $guru->id,
            'kode' => 'TND-' . str_pad(Kebutuhan::where('tipe', 'kebutuhan_guru')->count() + 1, 2, '0', STR_PAD_LEFT),
            'judul' => $request->judul,
            'kategori' => $request->kategori,
            'tanggal' => now()->format('d M Y'),
            'status' => 'menunggu',
            'status_label' => 'Menunggu Verifikasi Sekolah',
            'estimasi_biaya' => $request->estimasi_biaya,
            'justifikasi' => $request->justifikasi,
            'biaya' => $request->estimasi_biaya,
            'keterangan' => $request->justifikasi,
            'tipe' => 'kebutuhan_guru',
            'pemohon' => $guru->nama,
            'peran_pemohon' => $guru->jabatan,
        ]);

        // Create verification record for admin
        $verifikasi = Kebutuhan::create([
            'sekolah_id' => $guru->sekolah_id,
            'guru_id' => $guru->id,
            'kode' => 'VRF-' . str_pad(Kebutuhan::where('tipe', 'verifikasi')->count() + 1, 3, '0', STR_PAD_LEFT),
            'judul' => $request->judul,
            'kategori' => $request->kategori,
            'pemohon' => $guru->nama,
            'peran_pemohon' => $guru->jabatan,
            'tanggal' => now()->format('d M Y'),
            'urgensi' => $request->urgensi ?? 'Sedang',
            'estimasi_biaya' => $request->estimasi_biaya,
            'justifikasi' => $request->justifikasi,
            'status' => 'menunggu',
            'status_label' => 'Menunggu Verifikasi',
            'tipe' => 'verifikasi',
        ]);

        return response()->json([
            'message' => 'Kebutuhan berhasil diajukan.',
            'kebutuhan' => $kebutuhanGuru,
            'verifikasi' => $verifikasi,
        ], 201);
    }

    /**
     * Update a need.
     * PUT /api/guru/kebutuhan/{id}
     */
    public function updateKebutuhan(Request $request, $id)
    {
        $kebutuhan = Kebutuhan::where('guru_id', $request->user()->guru?->id)
            ->findOrFail($id);

        $kebutuhan->update($request->only([
            'judul', 'kategori', 'estimasi_biaya', 'justifikasi', 'keterangan',
        ]));

        return response()->json([
            'message' => 'Kebutuhan berhasil diperbarui.',
            'kebutuhan' => $kebutuhan->fresh(),
        ]);
    }

    /**
     * Delete a need.
     * DELETE /api/guru/kebutuhan/{id}
     */
    public function deleteKebutuhan(Request $request, $id)
    {
        $kebutuhan = Kebutuhan::where('guru_id', $request->user()->guru?->id)
            ->findOrFail($id);

        $kebutuhan->delete();

        return response()->json([
            'message' => 'Kebutuhan berhasil dihapus.',
        ]);
    }
}
