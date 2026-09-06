<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'sekolah_id', 'kode', 'nip', 'nama', 'gender', 'mapel',
        'kelas_ajar', 'jabatan', 'status_kepegawaian', 'sertifikasi',
        'pendidikan', 'lama_mengajar', 'poin_kontribusi', 'kebutuhan',
        'telepon', 'email', 'avatar',
    ];

    protected function casts(): array
    {
        return [
            'kelas_ajar' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }

    public function jadwals()
    {
        return $this->hasMany(Jadwal::class);
    }

    public function kebutuhans()
    {
        return $this->hasMany(Kebutuhan::class);
    }

    public function kelasWali()
    {
        return $this->hasMany(Kelas::class, 'wali_kelas_id');
    }
}
