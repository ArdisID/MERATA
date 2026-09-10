<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Models\Guru;
use App\Models\Kebutuhan;
use App\Models\Kelas;
use App\Models\Materi;
use App\Models\PengirimanBantuan;
use App\Models\ProfilDinas;
use App\Models\Sekolah;
use App\Models\Siswa;
use App\Models\Submateri;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PemerintahController extends Controller
{
    /**
     * Dashboard stats for government oversight.
     * GET /api/pemerintah/dashboard
     */
    public function dashboard(Request $request)
    {
        $totalSekolah = Sekolah::count();
        $totalSiswa   = Siswa::count();
        $totalGuru    = Guru::count();
        // Use lab_komputer as a proxy for priority/needs — adjust if a proper status column is added later
        $sekolahPrioritas = Sekolah::where('wilayah', 'like', '%Seribu%')->count()
            + Sekolah::whereNotNull('wilayah')->where('lab_komputer', 0)->count();

        return response()->json([
            'total_sekolah'          => $totalSekolah,
            'total_siswa'            => $totalSiswa,
            'total_guru'             => $totalGuru,
            'sekolah_prioritas'      => max($sekolahPrioritas, 0),
            'total_anggaran_tersedia' => 'Rp 45.000.000.000',
            'anggaran_terealisasi'   => 'Rp 31.850.000.000 (70.7%)',
            'bantuan_tersalurkan'    => PengirimanBantuan::where('tahap', 'Diterima')->count() ?: 182,
        ]);
    }

    /**
     * List all schools.
     * GET /api/pemerintah/sekolah
     */
    public function sekolahList(Request $request)
    {
        $query = Sekolah::with('admin');

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
        $sekolah = Sekolah::with(['gurus', 'siswas', 'kelasList', 'fasilitas', 'admin'])->findOrFail($id);
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
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhereHas('sekolah', function ($sq) use ($search) {
                      $sq->where('nama', 'like', "%{$search}%");
                  });
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
     * Publish new curriculum material with optional submaterials.
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
            'submateris' => 'nullable|array',
        ]);

        $submaterisData = $request->submateris ?? [];
        $countSub = count($submaterisData);

        $materi = Materi::create([
            'kode' => 'MAT-' . str_pad(Materi::count() + 1, 3, '0', STR_PAD_LEFT),
            'jenjang' => $request->jenjang,
            'kelas' => $request->kelas,
            'mapel' => $request->mapel,
            'topik' => $request->topik,
            'jumlah_submateri' => $countSub,
            'author' => $request->author ?? 'Dinas Pendidikan',
            'tanggal_terbit' => now()->format('d M Y'),
            'status' => 'Terdistribusi Nasional',
            'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'deskripsi' => $request->deskripsi,
        ]);

        foreach ($submaterisData as $index => $sub) {
            Submateri::create([
                'materi_id' => $materi->id,
                'nomor' => $sub['nomor'] ?? ($index + 1),
                'judul' => $sub['judul'] ?? ('Submateri ' . ($index + 1)),
                'durasi' => $sub['durasi'] ?? '45 Menit',
                'materi_utama' => $sub['materi_utama'] ?? ($sub['materiUtama'] ?? ($sub['ringkasan'] ?? '')),
                'tujuan' => $sub['tujuan'] ?? [],
                'ilustrasi' => $sub['ilustrasi'] ?? null,
                'video' => $sub['video'] ?? null,
                'video_url' => $sub['video_url'] ?? $sub['videoUrl'] ?? null,
                'ppt_url' => $sub['ppt_url'] ?? $sub['pptUrl'] ?? null,
                'ppt_filename' => $sub['ppt_filename'] ?? $sub['pptFilename'] ?? null,
                'contoh_soal' => $sub['contoh_soal'] ?? [],
                'slides' => $sub['slides'] ?? [],
            ]);
        }

        $materi->load('submateris');

        return response()->json([
            'message' => 'Materi baru berhasil dipublikasikan.',
            'materi' => $materi,
        ], 201);
    }

    /**
     * Update an existing curriculum material and its submaterials.
     * PUT /api/pemerintah/materi/{id}
     */
    public function updateMateri(Request $request, $id)
    {
        $materi = Materi::find($id);
        if (!$materi) {
            $materi = Materi::where('kode', $id)->orWhere('topik', 'like', "%{$id}%")->first();
        }
        if (!$materi) {
            return response()->json(['message' => 'Materi tidak ditemukan.'], 404);
        }

        $request->validate([
            'jenjang' => 'nullable|string',
            'kelas' => 'nullable|string',
            'mapel' => 'nullable|string',
            'topik' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'submateris' => 'nullable|array',
        ]);

        $materi->update([
            'jenjang' => $request->jenjang ?? $materi->jenjang,
            'kelas' => $request->kelas ?? $materi->kelas,
            'mapel' => $request->mapel ?? $materi->mapel,
            'topik' => $request->topik ?? $materi->topik,
            'deskripsi' => $request->deskripsi ?? $materi->deskripsi,
            'author' => $request->author ?? $materi->author,
        ]);

        if ($request->has('submateris')) {
            $submaterisData = $request->submateris ?? [];
            $materi->submateris()->delete();

            foreach ($submaterisData as $index => $sub) {
                Submateri::create([
                    'materi_id' => $materi->id,
                    'nomor' => $sub['nomor'] ?? ($index + 1),
                    'judul' => $sub['judul'] ?? ('Submateri ' . ($index + 1)),
                    'durasi' => $sub['durasi'] ?? '45 Menit',
                    'materi_utama' => $sub['materi_utama'] ?? ($sub['materiUtama'] ?? ($sub['ringkasan'] ?? '')),
                    'tujuan' => $sub['tujuan'] ?? [],
                    'ilustrasi' => $sub['ilustrasi'] ?? null,
                    'video' => $sub['video'] ?? null,
                    'video_url' => $sub['video_url'] ?? $sub['videoUrl'] ?? null,
                    'ppt_url' => $sub['ppt_url'] ?? $sub['pptUrl'] ?? null,
                    'ppt_filename' => $sub['ppt_filename'] ?? $sub['pptFilename'] ?? null,
                    'contoh_soal' => $sub['contoh_soal'] ?? [],
                    'slides' => $sub['slides'] ?? [],
                ]);
            }

            $materi->update([
                'jumlah_submateri' => count($submaterisData),
            ]);
        }

        $materi->load('submateris');

        return response()->json([
            'message' => 'Materi berhasil diperbarui.',
            'materi' => $materi,
        ]);
    }

    /**
     * Delete a material.
     * DELETE /api/pemerintah/materi/{id}
     */
    public function deleteMateri($id)
    {
        $materi = Materi::find($id);
        if ($materi) {
            $materi->submateris()->delete();
            $materi->delete();
        }
        return response()->json(['message' => 'Materi berhasil dihapus.']);
    }

    /**
     * Add a new submaterial to an existing material.
     * POST /api/pemerintah/materi/{id}/submateri
     */
    public function storeSubmateri(Request $request, $id)
    {
        $materi = Materi::find($id);
        if (!$materi) {
            $materi = Materi::where('kode', $id)->orWhere('topik', 'like', "%{$id}%")->first();
        }
        if (!$materi) {
            $materi = Materi::first();
        }

        if (!$materi) {
            $materi = Materi::create([
                'kode' => 'MAT-001',
                'jenjang' => 'SMP / Fase D',
                'kelas' => 'Kelas 8 SMP',
                'mapel' => 'Ilmu Pengetahuan Alam (IPA)',
                'topik' => 'Modul Kurikulum Merdeka',
                'author' => 'Dinas Pendidikan',
                'deskripsi' => 'Modul pembelajaran terintegrasi',
                'jumlah_submateri' => 0,
            ]);
        }

        $request->validate([
            'judul' => 'required|string',
            'durasi' => 'nullable|string',
            'materi_utama' => 'nullable|string',
        ]);

        $nextNomor = ($materi->submateris()->max('nomor') ?? 0) + 1;

        $submateri = Submateri::create([
            'materi_id' => $materi->id,
            'nomor' => $request->nomor ?? $nextNomor,
            'judul' => $request->judul,
            'durasi' => $request->durasi ?? '45 Menit',
            'materi_utama' => $request->materi_utama ?? $request->ringkasan ?? '',
            'tujuan' => $request->tujuan ?? [],
            'ilustrasi' => $request->ilustrasi ?? null,
            'video' => $request->video ?? null,
            'video_url' => $request->video_url ?? null,
            'ppt_url' => $request->ppt_url ?? null,
            'ppt_filename' => $request->ppt_filename ?? null,
            'contoh_soal' => $request->contoh_soal ?? [],
            'slides' => $request->slides ?? [],
        ]);

        $materi->update([
            'jumlah_submateri' => $materi->submateris()->count(),
        ]);

        return response()->json([
            'message' => 'Submateri berhasil ditambahkan.',
            'submateri' => $submateri,
            'materi' => $materi->fresh('submateris'),
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
        $profil = ProfilDinas::where('user_id', $user->id)->first();

        if (!$profil) {
            $profil = ProfilDinas::create([
                'user_id' => $user->id,
                'nama' => $user->name,
                'nip' => '196908121994031002',
                'instansi' => 'Dinas Pendidikan Provinsi DKI Jakarta',
                'jabatan' => 'Kepala Bidang Pembinaan SMP & Fasilitasi Mutu Pendidikan',
                'wilayah_kerja' => 'Provinsi DKI Jakarta',
                'email' => $user->email,
                'telepon' => '(021) 395-8821',
                'avatar' => $user->avatar ?: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
                'alamat_kantor' => 'Jl. Gatot Subroto Kav. 40-41, Kuningan Barat, Jakarta Selatan',
                'website' => 'https://disdik.jakarta.go.id',
            ]);
        }

        return response()->json($profil);
    }

    /**
     * Update government profile.
     * PUT /api/pemerintah/profil
     */
    public function updateProfil(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'nip' => 'nullable|string|max:50',
            'instansi' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'wilayah_kerja' => 'required|string|max:255',
            'telepon' => 'nullable|string|max:50',
            'avatar' => 'nullable|string',
            'alamat_kantor' => 'nullable|string|max:500',
            'website' => 'nullable|string|max:255',
        ]);

        $profil = ProfilDinas::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nama' => $user->name,
                'nip' => $request->nip ?? '196908121994031002',
                'instansi' => $request->instansi,
                'jabatan' => $request->jabatan,
                'wilayah_kerja' => $request->wilayah_kerja,
                'email' => $request->email,
                'telepon' => $request->telepon ?? '(021) 395-8821',
                'avatar' => $request->avatar ?? $user->avatar,
                'alamat_kantor' => $request->alamat_kantor,
                'website' => $request->website,
            ]
        );

        $profil->update($request->only([
            'nama', 'nip', 'instansi', 'jabatan', 'wilayah_kerja',
            'email', 'telepon', 'avatar', 'alamat_kantor', 'website'
        ]));

        // Sync with users table
        $user->update([
            'name' => $request->nama,
            'email' => $request->email,
            'avatar' => $request->avatar ?: $user->avatar,
        ]);

        return response()->json([
            'message' => 'Profil Dinas berhasil diperbarui.',
            'profil' => $profil->fresh(),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
            ]
        ]);
    }

    /**
     * Regional statistics and breakdown.
     * GET /api/pemerintah/statistik-wilayah
     */
    public function statistikWilayah(Request $request)
    {
        // Group schools by their actual 'wilayah' value in the database
        $byWilayah = Sekolah::selectRaw(
            'wilayah,
             COUNT(*) as total_sekolah,
             SUM(total_siswa) as total_siswa,
             SUM(total_guru) as total_guru,
             SUM(lab_komputer) as total_lab'
        )->groupBy('wilayah')->orderBy('wilayah')->get();

        $wilayahData = [];

        foreach ($byWilayah as $row) {
            $totSek  = (int) $row->total_sekolah;
            $totSis  = (int) ($row->total_siswa ?? 0);
            $totGur  = (int) ($row->total_guru  ?? 0);

            // Priority schools: in Kepulauan Seribu (3T), or lacking computer lab, or having pending urgent needs
            $schoolIds = Sekolah::where('wilayah', $row->wilayah)->pluck('id');
            $urgentNeedsSchoolIds = Kebutuhan::whereIn('sekolah_id', $schoolIds)
                ->whereIn('urgensi', ['Mendesak', 'Tinggi'])
                ->whereIn('status', ['menunggu', 'diteruskan_pemda'])
                ->pluck('sekolah_id')
                ->toArray();

            $prio = Sekolah::where('wilayah', $row->wilayah)
                ->where(function ($q) use ($urgentNeedsSchoolIds) {
                    $q->where('wilayah', 'like', '%Seribu%')
                      ->orWhereNull('lab_komputer')
                      ->orWhere('lab_komputer', 0)
                      ->orWhereIn('id', $urgentNeedsSchoolIds);
                })
                ->count();

            $rasio = $totGur > 0 ? ('1:' . round($totSis / max($totGur, 1), 1)) : '1:0';

            // Budget figures: base allocation proportional to school count
            $alokasiM   = $totSek > 0 ? round($totSek * 0.5, 2) : 0;
            $realizasiM = $totSek > 0 ? round($alokasiM * 0.71, 2) : 0;
            $pctReal    = $alokasiM > 0 ? round(($realizasiM / $alokasiM) * 100, 1) : 0;

            $sarprasRusak = $totSek > 0 ? (int) round(($prio / $totSek) * 100) : 0;
            $sarprasSed   = $sarprasRusak > 0 ? min(10, 100 - $sarprasRusak) : 10;
            $sarprasBaik  = max(0, 100 - $sarprasRusak - $sarprasSed);

            // Build a short slug-id from wilayah string
            $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '', str_replace(
                ['Jakarta ', 'Kepulauan ', ' '], ['jak', 'kep', ''], $row->wilayah
            )));

            $status = (str_contains($row->wilayah, 'Seribu') || $prio >= $totSek * 0.5) ? 'Prioritas 3T' :
                      ($prio > 0 ? 'Perlu Perhatian' :
                      ($totSek > 0 ? 'Sangat Baik' : 'Belum Ada Data'));

            $wilayahData[] = [
                'id'                    => $slug,
                'wilayah'               => $row->wilayah,
                'total_sekolah'         => $totSek,
                'total_siswa'           => $totSis,
                'total_guru'            => $totGur,
                'sekolah_prioritas'     => $prio,
                'anggaran_alokasi'      => $alokasiM,
                'anggaran_terealisasi'  => $realizasiM,
                'persentase_realisasi'  => $pctReal,
                'sarpras_baik'          => $sarprasBaik,
                'sarpras_sedang'        => $sarprasSed,
                'sarpras_rusak'         => $sarprasRusak,
                'rasio_guru_siswa'      => $rasio,
                'status_pemerataan'     => $status,
            ];
        }

        $totalSekolah     = Sekolah::count();
        $totalSiswa       = (int) (Sekolah::sum('total_siswa') ?: Siswa::count());
        $totalGuru        = (int) (Sekolah::sum('total_guru') ?: Guru::count());
        $sekolahPrioritas = array_sum(array_column($wilayahData, 'sekolah_prioritas'));

        // Dynamic categories from kebutuhans table
        $kategoriList = Kebutuhan::selectRaw('kategori, count(*) as total')
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->get();

        $totalUsulan = Kebutuhan::count() ?: 1;
        $kategoriBreakdown = [];
        foreach ($kategoriList as $k) {
            $kategoriBreakdown[] = [
                'kategori'      => $k->kategori,
                'persen'        => (int) round(($k->total / $totalUsulan) * 100),
                'jumlah_usulan' => (int) $k->total,
            ];
        }

        if (empty($kategoriBreakdown)) {
            $kategoriBreakdown = [
                ['kategori' => 'Lab Komputer & Perangkat TIK',   'persen' => 42, 'jumlah_usulan' => 14],
                ['kategori' => 'Sanitasi & Toilet Siswa Sehat',  'persen' => 28, 'jumlah_usulan' => 10],
                ['kategori' => 'Ruang Perpustakaan & Buku Teks', 'persen' => 18, 'jumlah_usulan' => 6],
                ['kategori' => 'Renovasi Atap & Ruang Kelas',    'persen' => 12, 'jumlah_usulan' => 4],
            ];
        }

        return response()->json([
            'summary' => [
                'total_sekolah'                => $totalSekolah,
                'total_siswa'                  => $totalSiswa,
                'total_guru'                   => $totalGuru,
                'sekolah_prioritas'            => max($sekolahPrioritas, 0),
                'total_anggaran_alokasi'       => round($totalSekolah * 0.5, 2),
                'total_anggaran_terealisasi'   => round($totalSekolah * 0.5 * 0.71, 2),
                'persentase_realisasi_total'   => 71.0,
                'rata_sarpras_layak'           => 78.4,
                'indeks_pemerataan'            => 'B+ (Taraf Pemerataan Nasional)',
            ],
            'wilayah'                        => $wilayahData,
            'kategori_kebutuhan_tertinggi'   => $kategoriBreakdown,
        ]);
    }

    /**
     * Create school admin account for a specific school.
     * POST /api/pemerintah/sekolah/{id}/admin
     */
    public function createAdminSekolah(Request $request, $id)
    {
        $sekolah = Sekolah::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'password'   => Hash::make($validated['password']),
            'role'       => 'admin',
            'sekolah_id' => $sekolah->id,
        ]);

        return response()->json([
            'message' => 'Akun admin sekolah berhasil dibuat',
            'user' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'role'     => $user->role,
                'sekolah'  => [
                    'id'   => $sekolah->id,
                    'nama' => $sekolah->nama,
                    'npsn' => $sekolah->npsn,
                ]
            ]
        ], 201);
    }

    /**
     * Update school admin account (name, email, password).
     * PUT /api/pemerintah/sekolah/{id}/admin
     */
    public function updateAdminSekolah(Request $request, $id)
    {
        $sekolah = Sekolah::findOrFail($id);
        $admin = User::where('sekolah_id', $sekolah->id)->where('role', 'admin')->first();

        if (!$admin) {
            return response()->json(['message' => 'Akun admin untuk sekolah ini belum dibuat.'], 404);
        }

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $admin->id,
            'password' => 'nullable|string|min:6',
        ]);

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];
        if (!empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }
        $admin->save();

        return response()->json([
            'message' => 'Akun admin sekolah berhasil diperbarui',
            'user' => [
                'id'       => $admin->id,
                'name'     => $admin->name,
                'email'    => $admin->email,
                'role'     => $admin->role,
                'sekolah'  => [
                    'id'   => $sekolah->id,
                    'nama' => $sekolah->nama,
                    'npsn' => $sekolah->npsn,
                ]
            ]
        ]);
    }
}

