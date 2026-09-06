<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'sekolah_id', 'kode', 'nama', 'tingkat', 'ruang',
        'wali_kelas_id', 'wali_kelas_nama', 'total_siswa',
        'laki_laki', 'perempuan', 'kehadiran_rata', 'status',
    ];

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class);
    }

    public function waliKelas()
    {
        return $this->belongsTo(Guru::class, 'wali_kelas_id');
    }

    public function siswas()
    {
        return $this->hasMany(Siswa::class);
    }

    public function jadwals()
    {
        return $this->hasMany(Jadwal::class);
    }
}
