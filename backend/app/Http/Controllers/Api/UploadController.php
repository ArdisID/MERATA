<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload a media file or document.
     * POST /api/upload
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf,docx|max:10240',
            'type' => 'nullable|string|in:sarpras,dokumen,bukti,materi,avatar',
        ]);

        $file = $request->file('file');
        $type = $request->input('type', 'sarpras');

        // Generate safe unique filename
        $extension = $file->getClientOriginalExtension();
        $safeName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = $safeName . '_' . time() . '_' . Str::random(6) . '.' . $extension;

        // Store into storage/app/public/{type}
        $path = $file->storeAs($type, $filename, 'public');

        $url = url('/storage/' . $path);

        return response()->json([
            'message' => 'File berhasil diunggah.',
            'url' => $url,
            'path' => $path,
            'filename' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime' => $file->getClientMimeType(),
        ], 201);
    }
}
