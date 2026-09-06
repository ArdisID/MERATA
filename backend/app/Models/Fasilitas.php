<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fasilitas extends Model
{
    use HasFactory;

    protected $table = 'fasilitas';

    protected $fillable = [
        'sekolah_id', 'kode', 'nama', 'lokasi', 'kondisi', 'kondisi_badge',
        'jumlah_total', 'jumlah_baik', 'jumlah_rusak', 'keterangan',
        'kebutuhan_tambahan', 'terakhir_cek',
    ];

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }
}
