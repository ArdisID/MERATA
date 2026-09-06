<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Sekolah;
use App\Models\Siswa;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Dashboard stats for the school admin.
     * GET /api/admin/dashboard
     */
    public function dashboard(Request $request)
    {
        $sekolah = Sekolah::first(); // For now, single school

        if (!$sekolah) {
            return response()->json(['message' => 'Data sekolah tidak ditemukan.'], 404);
        }

        $totalSiswa = Siswa::where('sekolah_id', $sekolah->id)->count();
        $totalGuru = Guru::where('sekolah_id', $sekolah->id)->count();
        $totalKelas = Kelas::where('sekolah_id', $sekolah->id)->count();

        $siswas = Siswa::where('sekolah_id', $sekolah->id)->get();
        $kehadiranRata = $siswas->count() > 0 ? round($siswas->avg('kehadiran'), 1) . '%' : '0%';

        return response()->json([
            'sekolah' => $sekolah->nama,
            'total_siswa' => $totalSiswa,
            'trend_siswa' => $sekolah->trend_siswa,
            'total_guru' => $totalGuru,
            'trend_guru' => $sekolah->trend_guru,
            'total_kelas' => $totalKelas,
            'trend_kelas' => $sekolah->trend_kelas,
            'tingkat_kehadiran' => $kehadiranRata,
            'trend_kehadiran' => $sekolah->trend_kehadiran,
            'lab_komputer' => $sekolah->lab_komputer,
            'lab_ipa' => $sekolah->lab_ipa,
        ]);
    }

    /**
     * List all students.
     * GET /api/admin/siswa
     */
    public function siswaList(Request $request)
    {
        $query = Siswa::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhere('kelas_nama', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('nama')->get());
    }

    /**
     * Update student data.
     * PUT /api/admin/siswa/{id}
     */
    public function updateSiswa(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->update($request->only([
            'nama', 'gender', 'kelas_nama', 'kehadiran', 'status_kehadiran',
            'nilai_rata_rata', 'status_bantuan', 'kebutuhan', 'catatan',
            'riwayat_bantuan',
        ]));

        return response()->json([
            'message' => 'Data siswa berhasil diperbarui.',
            'siswa' => $siswa->fresh(),
        ]);
    }

    /**
     * List all teachers.
     * GET /api/admin/guru
     */
    public function guruList(Request $request)
    {
        $query = Guru::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('mapel', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('nama')->get());
    }

    /**
     * List all classes with schedules.
     * GET /api/admin/kelas
     */
    public function kelasList(Request $request)
    {
        return response()->json(
            Kelas::with('jadwals')->orderBy('tingkat')->orderBy('nama')->get()
        );
    }

    /**
     * List all facilities.
     * GET /api/admin/fasilitas
     */
    public function fasilitasList(Request $request)
    {
        return response()->json(Fasilitas::orderBy('nama')->get());
    }

    /**
     * Update facility data.
     * PUT /api/admin/fasilitas/{id}
     */
    public function updateFasilitas(Request $request, $id)
    {
        $fasilitas = Fasilitas::findOrFail($id);
        $fasilitas->update($request->only([
            'nama', 'lokasi', 'kondisi', 'kondisi_badge',
            'jumlah_total', 'jumlah_baik', 'jumlah_rusak',
            'keterangan', 'kebutuhan_tambahan', 'terakhir_cek',
        ]));

        return response()->json([
            'message' => 'Data fasilitas berhasil diperbarui.',
            'fasilitas' => $fasilitas->fresh(),
        ]);
    }

    /**
     * Create a new student.
     * POST /api/admin/siswa
     */
    public function storeSiswa(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'nisn' => 'required|string',
        ]);

        $sekolah = Sekolah::first();
        $count = Siswa::count() + 1;
        $kode = 'SIS-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $siswa = Siswa::create([
            'sekolah_id' => $sekolah ? $sekolah->id : 1,
            'kode' => $kode,
            'nisn' => $request->nisn,
            'nama' => $request->nama,
            'gender' => $request->gender ?? 'Laki-laki',
            'kelas_nama' => $request->kelas ?? '7A',
            'kehadiran' => 100,
            'status_kehadiran' => 'Baik',
            'nilai_rata_rata' => 80.0,
            'status_bantuan' => $request->status_bantuan ?? 'Belum Ada',
            'bantuan_badge' => 'bg-gray-100 text-gray-700 border-gray-200',
            'kebutuhan' => $request->kebutuhan,
            'catatan' => $request->catatan,
            'riwayat_bantuan' => [],
        ]);

        return response()->json([
            'message' => 'Siswa berhasil ditambahkan.',
            'siswa' => $siswa,
        ], 201);
    }

    /**
     * Create a new facility.
     * POST /api/admin/fasilitas
     */
    public function storeFasilitas(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
        ]);

        $sekolah = Sekolah::first();
        $count = Fasilitas::count() + 1;
        $kode = 'FAS-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $badge = $request->kondisi === 'Baik'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : ($request->kondisi === 'Rusak Ringan' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200');

        $fasilitas = Fasilitas::create([
            'sekolah_id' => $sekolah ? $sekolah->id : 1,
            'kode' => $kode,
            'nama' => $request->nama,
            'lokasi' => $request->lokasi ?? 'Gedung Utama',
            'kondisi' => $request->kondisi ?? 'Baik',
            'kondisi_badge' => $badge,
            'jumlah_total' => $request->jumlah_total ?? 1,
            'jumlah_baik' => $request->jumlah_baik ?? 1,
            'jumlah_rusak' => $request->jumlah_rusak ?? 0,
            'keterangan' => $request->keterangan,
            'kebutuhan_tambahan' => $request->kebutuhan_tambahan,
            'terakhir_cek' => now()->format('d M Y'),
        ]);

        return response()->json([
            'message' => 'Fasilitas berhasil ditambahkan.',
            'fasilitas' => $fasilitas,
        ], 201);
    }
}
