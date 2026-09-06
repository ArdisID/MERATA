<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengirimanBantuan extends Model
{
    use HasFactory;

    protected $table = 'pengiriman_bantuans';

    protected $fillable = [
        'sekolah_id', 'kode', 'program', 'sumber_dana', 'tahap',
        'tahap_index', 'jumlah_item', 'ekspedisi', 'status_kondisi',
        'tanggal_kirim', 'estimasi_tiba', 'penerima',
    ];

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }
}
