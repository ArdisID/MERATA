<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Sekolah;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Dashboard stats for the school admin.
     * GET /api/admin/dashboard
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id;

        // Fallback: if admin has no sekolah_id yet, try linking via guru profile or use first school
        if (!$sekolahId && $user->guru) {
            $sekolahId = $user->guru->sekolah_id;
        }
        if (!$sekolahId) {
            $sekolahId = Sekolah::value('id');
        }

        $sekolah = Sekolah::find($sekolahId);
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
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $query = Siswa::where('sekolah_id', $sekolahId);

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
     * Store a new student.
     * POST /api/admin/siswa
     */
    public function storeSiswa(Request $request)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $request->validate([
            'nama' => 'required|string|max:255',
            'nisn' => 'required|string|max:30',
            'gender' => 'nullable|string|in:Laki-laki,Perempuan',
            'kelas' => 'nullable|string|max:50',
            'status_bantuan' => 'nullable|string|max:100',
            'kebutuhan' => 'nullable|string|max:255',
            'catatan' => 'nullable|string',
        ]);

        $kelasNama = $request->kelas ?? $request->kelas_nama;

        // Cek kelas berdasarkan sekolah tersebut
        $kelasObj = Kelas::where('sekolah_id', $sekolahId)
            ->where(function ($q) use ($kelasNama) {
                $q->where('nama', $kelasNama)->orWhere('kode', $kelasNama);
            })->first();

        $sekolah = Sekolah::find($sekolahId);
        $cleanSchName = $sekolah ? strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $sekolah->nama), 0, 5)) : 'SEK';
        $count = Siswa::where('sekolah_id', $sekolahId)->count() + 1;
        $kode = 'SIS-' . $cleanSchName . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $badgeFor = match ($request->status_bantuan) {
            'Penerima KIP', 'Penerima KJP Plus', 'Penerima KJP / KIP' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Beasiswa Prestasi' => 'bg-blue-50 text-blue-700 border-blue-200',
            default => 'bg-slate-50 text-slate-600 border-slate-200',
        };

        $siswa = Siswa::create([
            'sekolah_id' => $sekolahId,
            'kelas_id' => $kelasObj?->id,
            'kode' => $kode,
            'nisn' => $request->nisn,
            'nama' => $request->nama,
            'gender' => $request->gender ?? 'Laki-laki',
            'kelas_nama' => $kelasObj?->nama ?? $kelasNama,
            'kehadiran' => 100,
            'status_kehadiran' => 'Baik',
            'nilai_rata_rata' => 80.0,
            'status_bantuan' => $request->status_bantuan ?? 'Belum Ada',
            'bantuan_badge' => $badgeFor,
            'kebutuhan' => $request->kebutuhan,
            'catatan' => $request->catatan,
        ]);

        return response()->json([
            'message' => 'Data siswa berhasil ditambahkan.',
            'siswa' => $siswa,
        ], 201);
    }

    /**
     * Update student data.
     * PUT /api/admin/siswa/{id}
     */
    public function updateSiswa(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $siswa = Siswa::where('id', $id)->where('sekolah_id', $sekolahId)->firstOrFail();
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
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $query = Guru::where('sekolah_id', $sekolahId);

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
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        return response()->json(
            Kelas::with('jadwals')->where('sekolah_id', $sekolahId)->orderBy('tingkat')->orderBy('nama')->get()
        );
    }

    /**
     * Store new class (rombel).
     * POST /api/admin/kelas
     */
    public function storeKelas(Request $request)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $request->validate([
            'nama' => 'required|string|max:100',
            'tingkat' => 'nullable|string|max:20',
            'ruang' => 'nullable|string|max:100',
            'wali_kelas_nama' => 'nullable|string|max:255',
            'wali_kelas_id' => 'nullable|integer',
        ]);

        $count = Kelas::where('sekolah_id', $sekolahId)->count() + 1;
        $cleanName = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', $request->nama));
        $kode = 'KLS-' . substr($cleanName, 0, 8) . '-' . str_pad($count, 2, '0', STR_PAD_LEFT);

        $kelas = Kelas::create([
            'sekolah_id' => $sekolahId,
            'kode' => $kode,
            'nama' => $request->nama,
            'tingkat' => $request->tingkat ?? '10',
            'ruang' => $request->ruang ?? ('Ruang ' . $request->nama),
            'wali_kelas_id' => $request->wali_kelas_id,
            'wali_kelas_nama' => $request->wali_kelas_nama ?? '-',
            'total_siswa' => 0,
            'laki_laki' => 0,
            'perempuan' => 0,
            'kehadiran_rata' => '100%',
            'status' => 'Aktif',
        ]);

        return response()->json([
            'message' => 'Rombel kelas berhasil ditambahkan.',
            'kelas' => $kelas,
        ], 201);
    }

    /**
     * Delete a class.
     * DELETE /api/admin/kelas/{id}
     */
    public function destroyKelas(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $kelas = Kelas::where('id', $id)->where('sekolah_id', $sekolahId)->firstOrFail();
        $kelas->delete();

        return response()->json([
            'message' => 'Rombel kelas berhasil dihapus.',
        ]);
    }

    /**
     * List all facilities.
     * GET /api/admin/fasilitas
     */
    public function fasilitasList(Request $request)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        return response()->json(Fasilitas::where('sekolah_id', $sekolahId)->orderBy('nama')->get());
    }

    /**
     * Update facility data.
     * PUT /api/admin/fasilitas/{id}
     */
    public function updateFasilitas(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $fasilitas = Fasilitas::where('id', $id)->where('sekolah_id', $sekolahId)->firstOrFail();
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
     * DELETE /api/admin/fasilitas/{id}
     */
    public function deleteFasilitas(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $fasilitas = Fasilitas::where('id', $id)->where('sekolah_id', $sekolahId)->firstOrFail();
        $fasilitas->delete();

        return response()->json([
            'message' => 'Fasilitas berhasil dihapus.',
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

        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));
        $sekolah = Sekolah::find($sekolahId);
        $count = Siswa::where('sekolah_id', $sekolahId)->count() + 1;
        $kode = 'SIS-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $siswa = Siswa::create([
            'sekolah_id' => $sekolahId,
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

        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));
        $count = Fasilitas::where('sekolah_id', $sekolahId)->count() + 1;
        $kode = 'FAS-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $badge = $request->kondisi === 'Baik'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : ($request->kondisi === 'Rusak Ringan' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200');

        $fasilitas = Fasilitas::create([
            'sekolah_id' => $sekolahId,
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

    /**
     * Create a new teacher and create associated User account.
     * POST /api/admin/guru
     */
    public function storeGuru(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'mapel' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));
        $count = Guru::where('sekolah_id', $sekolahId)->count() + 1;
        $kode = 'GUR-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $kelasAjar = $request->kelas_ajar;
        if (is_string($kelasAjar)) {
            $kelasAjar = array_map('trim', explode(',', $kelasAjar));
        }

        // Determine email for guru and user
        $email = $request->email;
        if (empty($email)) {
            $nameClean = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', explode(' ', $request->nama)[0] ?? 'guru'));
            $email = $nameClean . $count . '@merata.sch.id';
        }

        // Ensure email is unique in users table
        $baseEmail = $email;
        $suffix = 1;
        while (User::where('email', $email)->exists()) {
            $parts = explode('@', $baseEmail);
            $email = $parts[0] . $suffix . '@' . ($parts[1] ?? 'merata.sch.id');
            $suffix++;
        }

        $passwordRaw = $request->password ?: 'password';

        // 1. Create User account in users table
        $newUser = User::create([
            'name' => $request->nama,
            'email' => $email,
            'password' => Hash::make($passwordRaw),
            'role' => 'guru',
            'sekolah_id' => $sekolahId,
            'avatar' => $request->avatar ?: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        ]);

        // 2. Create Guru record linked to user_id
        $guru = Guru::create([
            'user_id' => $newUser->id,
            'sekolah_id' => $sekolahId,
            'kode' => $kode,
            'nip' => $request->nip ?? '-',
            'nama' => $request->nama,
            'gender' => $request->gender ?? 'Laki-laki',
            'mapel' => $request->mapel,
            'kelas_ajar' => $kelasAjar ?? ['Kelas 7', 'Kelas 8'],
            'jabatan' => $request->jabatan ?? 'Guru Mata Pelajaran',
            'status_kepegawaian' => $request->status_kepegawaian ?? 'Honorer / Kontrak',
            'sertifikasi' => $request->sertifikasi ?? 'Belum',
            'pendidikan' => $request->pendidikan ?? 'S1 Pendidikan',
            'lama_mengajar' => $request->lama_mengajar ?? '1 Tahun',
            'poin_kontribusi' => 0,
            'telepon' => $request->telepon ?? '08123456789',
            'email' => $email,
            'avatar' => $newUser->avatar,
            'kebutuhan' => $request->kebutuhan ?? '-',
        ]);

        return response()->json([
            'message' => 'Data guru dan akun login pengguna (users) berhasil ditambahkan.',
            'guru' => $guru,
            'user' => [
                'id' => $newUser->id,
                'name' => $newUser->name,
                'email' => $newUser->email,
                'role' => $newUser->role,
            ],
            'login_info' => [
                'email' => $newUser->email,
                'default_password' => $passwordRaw,
            ]
        ], 201);
    }

    /**
     * Update teacher data and sync User account.
     * PUT /api/admin/guru/{id}
     */
    public function updateGuru(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $guru = Guru::where('sekolah_id', $sekolahId)->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('kode', $id);
        })->firstOrFail();

        $data = $request->only([
            'nama', 'nip', 'gender', 'mapel', 'jabatan',
            'status_kepegawaian', 'sertifikasi', 'pendidikan',
            'lama_mengajar', 'telepon', 'email', 'kebutuhan'
        ]);

        if ($request->has('kelas_ajar')) {
            $kelasAjar = $request->kelas_ajar;
            if (is_string($kelasAjar)) {
                $kelasAjar = array_map('trim', explode(',', $kelasAjar));
            }
            $data['kelas_ajar'] = $kelasAjar;
        }

        $guru->update($data);

        // Sync with users table
        if ($guru->user_id) {
            $userRecord = User::find($guru->user_id);
            if ($userRecord) {
                $userUpdates = [];
                if ($request->has('nama')) $userUpdates['name'] = $request->nama;
                if ($request->has('email') && !empty($request->email)) {
                    $emailExists = User::where('email', $request->email)->where('id', '!=', $userRecord->id)->exists();
                    if (!$emailExists) {
                        $userUpdates['email'] = $request->email;
                    }
                }
                if ($request->has('password') && !empty($request->password)) {
                    $userUpdates['password'] = Hash::make($request->password);
                }
                if (!empty($userUpdates)) {
                    $userRecord->update($userUpdates);
                }
            }
        } elseif (!empty($guru->email)) {
            // If guru didn't have user_id yet, link or create user
            $userRecord = User::where('email', $guru->email)->first();
            if (!$userRecord) {
                $userRecord = User::create([
                    'name' => $guru->nama,
                    'email' => $guru->email,
                    'password' => Hash::make($request->password ?: 'password'),
                    'role' => 'guru',
                    'sekolah_id' => $sekolahId,
                    'avatar' => $guru->avatar ?: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                ]);
            } else {
                $userRecord->update(['sekolah_id' => $sekolahId]);
            }
            $guru->update(['user_id' => $userRecord->id]);
        }

        return response()->json([
            'message' => 'Data guru berhasil diperbarui.',
            'guru' => $guru->fresh(),
        ]);
    }

    /**
     * Delete teacher and clean up linked User account.
     * DELETE /api/admin/guru/{id}
     */
    public function deleteGuru(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $guru = Guru::where('sekolah_id', $sekolahId)->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('kode', $id);
        })->firstOrFail();
        $userId = $guru->user_id;

        $guru->delete();

        if ($userId) {
            $linkedUser = User::find($userId);
            if ($linkedUser && $linkedUser->role === 'guru') {
                $linkedUser->delete();
            }
        }

        return response()->json([
            'message' => 'Data guru dan akun pengguna berhasil dihapus.',
        ]);
    }

    /**
     * Delete student.
     * DELETE /api/admin/siswa/{id}
     */
    public function deleteSiswa(Request $request, $id)
    {
        $user = $request->user();
        $sekolahId = $user->sekolah_id ?? ($user->guru?->sekolah_id ?? Sekolah::value('id'));

        $siswa = Siswa::where('sekolah_id', $sekolahId)->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('kode', $id);
        })->firstOrFail();
        $siswa->delete();

        return response()->json([
            'message' => 'Data siswa berhasil dihapus.',
        ]);
    }
}
