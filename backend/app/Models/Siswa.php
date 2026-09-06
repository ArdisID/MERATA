<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $fillable = [
        'sekolah_id', 'kelas_id', 'kode', 'nisn', 'nama', 'gender',
        'kelas_nama', 'kehadiran', 'status_kehadiran', 'nilai_rata_rata',
        'status_bantuan', 'bantuan_badge', 'kebutuhan', 'catatan',
        'riwayat_bantuan',
    ];

    protected function casts(): array
    {
        return [
            'riwayat_bantuan' => 'array',
            'kehadiran' => 'decimal:2',
            'nilai_rata_rata' => 'decimal:2',
        ];
    }

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
