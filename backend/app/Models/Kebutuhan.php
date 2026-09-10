<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kebutuhan extends Model
{
    use HasFactory;

    protected $table = 'kebutuhans';

    protected $fillable = [
        'sekolah_id', 'guru_id', 'kode', 'judul', 'kategori',
        'pemohon', 'peran_pemohon', 'tanggal', 'urgensi', 'urgensi_badge',
        'estimasi_biaya', 'justifikasi', 'status', 'status_label',
        'catatan_admin', 'lampiran', 'bukti_url', 'tipe', 'biaya', 'keterangan',
    ];

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }
}
