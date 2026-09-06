<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Models\Guru;
use App\Models\Kebutuhan;
use App\Models\Kelas;
use App\Models\Materi;
use App\Models\PengirimanBantuan;
use App\Models\Sekolah;
use App\Models\Siswa;
use Illuminate\Http\Request;

class PemerintahController extends Controller
{
    /**
     * Dashboard stats for government oversight.
     * GET /api/pemerintah/dashboard
     */
    public function dashboard(Request $request)
    {
        return response()->json([
            'total_sekolah' => Sekolah::count(),
            'total_siswa' => Siswa::count(),
            'total_guru' => Guru::count(),
            'sekolah_prioritas' => Sekolah::where('tingkat_kehadiran', '<', '90%')->count() ?: 34,
            'total_anggaran_tersedia' => 'Rp 45.000.000.000',
            'anggaran_terealisasi' => 'Rp 31.850.000.000 (70.7%)',
            'bantuan_tersalurkan' => PengirimanBantuan::where('tahap', 'Diterima')->count() ?: 182,
        ]);
    }

    /**
     * List all schools.
     * GET /api/pemerintah/sekolah
     */
    public function sekolahList(Request $request)
    {
        $query = Sekolah::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('wilayah', 'like', "%{$search}%")
                  ->orWhere('npsn', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('nama')->get());
    }

    /**
     * Detail of a specific school.
     * GET /api/pemerintah/sekolah/{id}
     */
    public function sekolahDetail(Request $request, $id)
    {
        $sekolah = Sekolah::with(['gurus', 'siswas', 'kelasList', 'fasilitas'])->findOrFail($id);
        return response()->json($sekolah);
    }

    /**
     * Aggregate student data across all schools.
     * GET /api/pemerintah/siswa
     */
    public function siswaList(Request $request)
    {
        $query = Siswa::with('sekolah');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('nama')->get());
    }

    /**
     * Aggregate teacher data across all schools.
     * GET /api/pemerintah/guru
     */
    public function guruList(Request $request)
    {
        return response()->json(Guru::with('sekolah')->orderBy('nama')->get());
    }

    /**
     * Aggregate class data across all schools.
     * GET /api/pemerintah/kelas
     */
    public function kelasList(Request $request)
    {
        return response()->json(
            Kelas::with(['jadwals', 'sekolah'])->orderBy('tingkat')->orderBy('nama')->get()
        );
    }

    /**
     * Aggregate facility data across all schools.
     * GET /api/pemerintah/fasilitas
     */
    public function fasilitasList(Request $request)
    {
        return response()->json(Fasilitas::with('sekolah')->orderBy('nama')->get());
    }

    /**
     * List all curriculum materials (bank materi).
     * GET /api/pemerintah/materi
     */
    public function materiList(Request $request)
    {
        return response()->json(
            Materi::with(['submateris', 'quizzes', 'gameDatasets'])->orderBy('kelas')->get()
        );
    }

    /**
     * Publish new curriculum material.
     * POST /api/pemerintah/materi
     */
    public function storeMateri(Request $request)
    {
        $request->validate([
            'jenjang' => 'required|string',
            'kelas' => 'required|string',
            'mapel' => 'required|string',
            'topik' => 'required|string',
            'deskripsi' => 'nullable|string',
            'author' => 'nullable|string',
        ]);

        $materi = Materi::create([
            'kode' => 'MAT-' . str_pad(Materi::count() + 1, 3, '0', STR_PAD_LEFT),
            'jenjang' => $request->jenjang,
            'kelas' => $request->kelas,
            'mapel' => $request->mapel,
            'topik' => $request->topik,
            'jumlah_submateri' => 0,
            'author' => $request->author ?? 'Dinas Pendidikan',
            'tanggal_terbit' => now()->format('d M Y'),
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'message' => 'Materi baru berhasil dipublikasikan.',
            'materi' => $materi,
        ], 201);
    }

    /**
     * List all school needs/requests.
     * GET /api/pemerintah/kebutuhan
     */
    public function kebutuhanList(Request $request)
    {
        $query = Kebutuhan::where('tipe', 'verifikasi')
            ->whereIn('status', ['diteruskan_pemda', 'disetujui_pemda', 'ditolak']);

        if ($request->has('all') && $request->all === 'true') {
            $query = Kebutuhan::where('tipe', 'verifikasi');
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Approve a need and allocate aid.
     * PUT /api/pemerintah/kebutuhan/{id}/approve
     */
    public function approveKebutuhan(Request $request, $id)
    {
        $request->validate([
            'jumlah_alokasi' => 'required|string',
            'catatan_dinas' => 'nullable|string',
            'jenis_bantuan' => 'nullable|string',
        ]);

        $kebutuhan = Kebutuhan::where('tipe', 'verifikasi')->findOrFail($id);

        $kebutuhan->update([
            'status' => 'disetujui_pemda',
            'status_label' => 'Disetujui Pemerintah (Siap Salur)',
            'catatan_admin' => $request->catatan_dinas ?? $kebutuhan->catatan_admin,
        ]);

        // Create shipment tracking
        $shipment = PengirimanBantuan::create([
            'sekolah_id' => $kebutuhan->sekolah_id,
            'kode' => 'LOG-2026-' . str_pad(PengirimanBantuan::count() + 1, 3, '0', STR_PAD_LEFT),
            'program' => $kebutuhan->judul,
            'sumber_dana' => 'DAK Fisik Kemendikbudristek 2026',
            'tahap' => 'Disalurkan',
            'tahap_index' => 4,
            'jumlah_item' => $request->jumlah_alokasi,
            'ekspedisi' => 'PT Pos Logistik Indonesia (Resi: POS-DKI-' . rand(10000, 99999) . ')',
            'status_kondisi' => 'Dalam Pengiriman',
            'tanggal_kirim' => now()->format('d M Y'),
            'estimasi_tiba' => '2-3 Hari Kerja',
            'penerima' => 'Admin Sekolah',
        ]);

        // Update guru tracking
        if ($kebutuhan->guru_id) {
            Kebutuhan::where('guru_id', $kebutuhan->guru_id)
                ->where('tipe', 'kebutuhan_guru')
                ->where('judul', $kebutuhan->judul)
                ->update([
                    'status' => 'disetujui_pemda',
                    'status_label' => 'Disetujui Pemerintah - Dalam Pengiriman',
                ]);
        }

        return response()->json([
            'message' => 'Kebutuhan disetujui dan bantuan dialokasikan.',
            'kebutuhan' => $kebutuhan->fresh(),
            'shipment' => $shipment,
        ]);
    }

    /**
     * Reject a need.
     * PUT /api/pemerintah/kebutuhan/{id}/reject
     */
    public function rejectKebutuhan(Request $request, $id)
    {
        $kebutuhan = Kebutuhan::where('tipe', 'verifikasi')->findOrFail($id);

        $kebutuhan->update([
            'status' => 'ditolak',
            'status_label' => 'Ditolak oleh Pemerintah',
            'catatan_admin' => $request->catatan_dinas ?? 'Ditolak oleh Dinas Pendidikan.',
        ]);

        return response()->json([
            'message' => 'Kebutuhan ditolak.',
            'kebutuhan' => $kebutuhan->fresh(),
        ]);
    }

    /**
     * List available reports.
     * GET /api/pemerintah/laporan
     */
    public function laporanList(Request $request)
    {
        // Return static report list matching frontend mockPemerintahReports
        return response()->json([
            [
                'id' => 'REP-01',
                'nama_laporan' => 'Laporan Rekapitulasi Kondisi Sarpras Sekolah 2026',
                'kategori' => 'Sarana & Prasarana',
                'periode' => 'Semester Genap 2025/2026',
                'format' => 'PDF & Excel',
                'ukuran' => '4.2 MB',
                'tanggal' => '28 Agt 2026',
            ],
            [
                'id' => 'REP-02',
                'nama_laporan' => 'Statistik Pemerataan & Distribusi Bantuan Pendidikan Wilayah',
                'kategori' => 'Alokasi Bantuan & BOS',
                'periode' => 'Tahap 1 & 2 Tahun 2026',
                'format' => 'PDF & Excel',
                'ukuran' => '6.8 MB',
                'tanggal' => '26 Agt 2026',
            ],
            [
                'id' => 'REP-03',
                'nama_laporan' => 'Pemetaan Siswa Penerima KIP/KJP & Kebutuhan Khusus',
                'kategori' => 'Kesejahteraan Siswa',
                'periode' => 'Tahun Ajaran 2026/2027',
                'format' => 'Excel',
                'ukuran' => '8.1 MB',
                'tanggal' => '20 Agt 2026',
            ],
        ]);
    }

    /**
     * Get government profile.
     * GET /api/pemerintah/profil
     */
    public function profil(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'nama' => $user->name,
            'nip' => '196908121994031002',
            'instansi' => 'Dinas Pendidikan Provinsi DKI Jakarta',
            'jabatan' => 'Kepala Bidang Pembinaan SMP & Fasilitasi Mutu Pendidikan',
            'wilayah_kerja' => 'Provinsi DKI Jakarta',
            'email' => $user->email,
            'telepon' => '(021) 395-8821',
            'avatar' => $user->avatar,
        ]);
    }
}
