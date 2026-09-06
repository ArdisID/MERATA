<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kebutuhan;
use App\Models\PengirimanBantuan;
use Illuminate\Http\Request;

class KebutuhanController extends Controller
{
    /**
     * List verifications pending for admin.
     * GET /api/admin/verifikasi
     */
    public function verifikasiList(Request $request)
    {
        $query = Kebutuhan::where('tipe', 'verifikasi');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('pemohon', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->get()
        );
    }

    /**
     * Update verification status (approve/reject/revise/forward).
     * PUT /api/admin/verifikasi/{id}
     */
    public function updateVerifikasi(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:setujui,tolak,revisi,teruskan',
            'catatan_admin' => 'nullable|string',
        ]);

        $kebutuhan = Kebutuhan::where('tipe', 'verifikasi')->findOrFail($id);

        $statusMap = [
            'setujui' => ['status' => 'disetujui_sekolah', 'label' => 'Disetujui Sekolah'],
            'tolak' => ['status' => 'ditolak', 'label' => 'Ditolak'],
            'revisi' => ['status' => 'revisi', 'label' => 'Perlu Revisi Data'],
            'teruskan' => ['status' => 'diteruskan_pemda', 'label' => 'Diteruskan ke Pemerintah'],
        ];

        $action = $statusMap[$request->action];
        $kebutuhan->update([
            'status' => $action['status'],
            'status_label' => $action['label'],
            'catatan_admin' => $request->catatan_admin ?? $kebutuhan->catatan_admin,
        ]);

        // Also update the guru's tracking record if exists
        if ($kebutuhan->guru_id) {
            $guruKebutuhan = Kebutuhan::where('guru_id', $kebutuhan->guru_id)
                ->where('tipe', 'kebutuhan_guru')
                ->where('judul', $kebutuhan->judul)
                ->first();

            if ($guruKebutuhan) {
                $guruKebutuhan->update([
                    'status' => $action['status'],
                    'status_label' => $action['label'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Status verifikasi berhasil diperbarui.',
            'kebutuhan' => $kebutuhan->fresh(),
        ]);
    }

    /**
     * List assistance shipment tracking.
     * GET /api/admin/bantuan
     */
    public function bantuanList(Request $request)
    {
        return response()->json(
            PengirimanBantuan::orderBy('created_at', 'desc')->get()
        );
    }
}
