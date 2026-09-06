<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submateri extends Model
{
    use HasFactory;

    protected $fillable = [
        'materi_id', 'nomor', 'judul', 'durasi', 'tujuan',
        'materi_utama', 'ilustrasi', 'video', 'contoh_soal',
        'slides',
    ];

    protected function casts(): array
    {
        return [
            'tujuan' => 'array',
            'ilustrasi' => 'array',
            'video' => 'array',
            'contoh_soal' => 'array',
            'slides' => 'array',
        ];
    }

    public function materi()
    {
        return $this->belongsTo(Materi::class);
    }
}
