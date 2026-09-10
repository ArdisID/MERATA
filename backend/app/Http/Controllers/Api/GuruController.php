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

        $sekolahId = $guru->sekolah_id ?? $request->user()->sekolah_id;
        $kelasAjar = $guru->kelas_ajar ?? [];
        $kelasList = Kelas::where('sekolah_id', $sekolahId)
            ->whereIn('kode', array_map(fn($k) => 'KLS-' . $k, $kelasAjar))
            ->withCount('siswas')
            ->get();

        $totalSiswa = $kelasList->sum('siswas_count');
        $siswas = Siswa::where('sekolah_id', $sekolahId)
            ->whereIn('kelas_nama', $kelasAjar)
            ->get();
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
     * List classes taught by the teacher or belonging to the teacher's school.
     * GET /api/guru/kelas
     */
    public function kelasList(Request $request)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        if (!$sekolahId) {
            $sekolahId = Sekolah::value('id');
        }

        $kelasAjar = $guru?->kelas_ajar ?? [];
        $query = Kelas::where('sekolah_id', $sekolahId)->with('jadwals');

        // If teacher has defined teaching classes that match classes in this school
        if (!empty($kelasAjar)) {
            $matchCount = (clone $query)->whereIn('nama', $kelasAjar)->count();
            if ($matchCount > 0) {
                $query->whereIn('nama', $kelasAjar);
            }
        }

        return response()->json($query->orderBy('tingkat')->orderBy('nama')->get());
    }

    /**
     * Detail of a specific class with students.
     * GET /api/guru/kelas/{id}
     */
    public function kelasDetail(Request $request, $id)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;

        $kelas = Kelas::with(['siswas', 'jadwals'])
            ->when($sekolahId, fn($q) => $q->where('sekolah_id', $sekolahId))
            ->findOrFail($id);

        return response()->json($kelas);
    }

    /**
     * List curriculum materials matching the teacher's school jenjang (SD, SMP, SMA, SMK).
     * GET /api/guru/materi
     */
    public function materiList(Request $request)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        $sekolah = $sekolahId ? Sekolah::find($sekolahId) : null;
        $jenjang = $sekolah?->jenjang ?? '';

        $query = Materi::with(['submateris', 'quizzes.soals', 'gameDatasets']);

        if ($jenjang) {
            $j = strtoupper($jenjang);
            if (str_contains($j, 'SMK')) {
                $query->where('jenjang', 'like', '%SMK%');
            } elseif (str_contains($j, 'SMA')) {
                $query->where('jenjang', 'like', '%SMA%');
            } elseif (str_contains($j, 'SD')) {
                $query->where('jenjang', 'like', '%SD%');
            } elseif (str_contains($j, 'SMP')) {
                $query->where('jenjang', 'like', '%SMP%');
            }
        }

        $materis = $query->orderBy('kode')->get();

        // Fallback: if no material found for that specific jenjang, return available ones
        if ($materis->isEmpty()) {
            $materis = Materi::with(['submateris', 'quizzes.soals', 'gameDatasets'])->get();
        }

        return response()->json($materis);
    }

    /**
     * Get materials for a class matching the school jenjang and class level.
     * GET /api/guru/kelas/{kelasKode}/materi
     */
    public function kelasMateri(Request $request, string $kelasKode)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        $sekolah = $sekolahId ? Sekolah::find($sekolahId) : null;

        // Check school first! Find class in this school
        $kelas = Kelas::when($sekolahId, fn($q) => $q->where('sekolah_id', $sekolahId))
            ->where(function ($q) use ($kelasKode) {
                $q->where('kode', $kelasKode)
                  ->orWhere('nama', $kelasKode)
                  ->orWhere('id', $kelasKode);
            })->first();

        $jenjang = $sekolah?->jenjang;
        $query = Materi::with(['submateris', 'quizzes.soals', 'gameDatasets']);

        if ($jenjang) {
            $j = strtoupper($jenjang);
            if (str_contains($j, 'SMK')) {
                $query->where('jenjang', 'like', '%SMK%');
            } elseif (str_contains($j, 'SMA')) {
                $query->where('jenjang', 'like', '%SMA%');
            } elseif (str_contains($j, 'SD')) {
                $query->where('jenjang', 'like', '%SD%');
            } elseif (str_contains($j, 'SMP')) {
                $query->where('jenjang', 'like', '%SMP%');
            }
        }

        $materis = $query->get();
        return response()->json($materis);
    }

    /**
     * Get quiz data for a class.
     * GET /api/guru/kelas/{kelasKode}/quiz
     */
    public function kelasQuiz(Request $request, string $kelasKode)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        $sekolah = $sekolahId ? Sekolah::find($sekolahId) : null;
        $jenjang = $sekolah?->jenjang;

        $query = Materi::query();
        if ($jenjang) {
            $j = strtoupper($jenjang);
            if (str_contains($j, 'SMK')) $query->where('jenjang', 'like', '%SMK%');
            elseif (str_contains($j, 'SMA')) $query->where('jenjang', 'like', '%SMA%');
            elseif (str_contains($j, 'SD')) $query->where('jenjang', 'like', '%SD%');
            elseif (str_contains($j, 'SMP')) $query->where('jenjang', 'like', '%SMP%');
        }

        $materiIds = $query->pluck('id');
        $quizzes = \App\Models\Quiz::with('soals')
            ->whereIn('materi_id', $materiIds)
            ->get();

        return response()->json($quizzes);
    }

    /**
     * Get game datasets for a class.
     * GET /api/guru/kelas/{kelasKode}/game
     */
    public function kelasGame(Request $request, string $kelasKode)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        $sekolah = $sekolahId ? Sekolah::find($sekolahId) : null;
        $jenjang = $sekolah?->jenjang;

        $query = Materi::query();
        if ($jenjang) {
            $j = strtoupper($jenjang);
            if (str_contains($j, 'SMK')) $query->where('jenjang', 'like', '%SMK%');
            elseif (str_contains($j, 'SMA')) $query->where('jenjang', 'like', '%SMA%');
            elseif (str_contains($j, 'SD')) $query->where('jenjang', 'like', '%SD%');
            elseif (str_contains($j, 'SMP')) $query->where('jenjang', 'like', '%SMP%');
        }

        $materiIds = $query->pluck('id');
        $games = \App\Models\GameDataset::whereIn('materi_id', $materiIds)->get();

        return response()->json($games);
    }

    /**
     * List students for monitoring - Scoped strictly to teacher's school first.
     * GET /api/guru/monitoring
     */
    public function monitoring(Request $request)
    {
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;
        if (!$sekolahId) {
            $sekolahId = Sekolah::value('id');
        }

        // WAJIB: cek sekolah dulu! Siswa dari sekolah lain tidak boleh masuk!
        $query = Siswa::where('sekolah_id', $sekolahId);

        // Filter kelas jika dikirim
        if ($request->has('kelas') && $request->kelas && $request->kelas !== 'all') {
            $filterKelas = $request->kelas;
            $query->where(function ($q) use ($filterKelas) {
                $q->where('kelas_nama', $filterKelas)
                  ->orWhere('kelas_id', $filterKelas);
            });
        }

        $siswas = $query->orderBy('nama')->get();

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
        $guru = $request->user()->guru;
        $sekolahId = $guru?->sekolah_id ?? $request->user()->sekolah_id;

        $siswa = Siswa::when($sekolahId, fn($q) => $q->where('sekolah_id', $sekolahId))->findOrFail($id);

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
        $guru->load('sekolah');

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
            'lampiran' => $request->lampiran,
            'bukti_url' => $request->bukti_url,
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
            'lampiran' => $request->lampiran,
            'bukti_url' => $request->bukti_url,
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
