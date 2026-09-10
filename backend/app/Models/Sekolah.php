<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sekolah extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama', 'npsn', 'akreditasi', 'status_sekolah', 'jenjang',
        'kepala_sekolah', 'nip_kepsek', 'operator', 'alamat', 'wilayah',
        'kode_pos', 'telepon', 'email', 'website', 'kurikulum',
        'total_siswa', 'trend_siswa', 'total_guru', 'trend_guru',
        'total_kelas', 'trend_kelas', 'tingkat_kehadiran', 'trend_kehadiran',
        'lab_komputer', 'lab_ipa', 'foto',
    ];

    public function admins()
    {
        return $this->hasMany(User::class)->where('role', 'admin');
    }

    public function admin()
    {
        return $this->hasOne(User::class)->where('role', 'admin');
    }

    public function gurus()
    {
        return $this->hasMany(Guru::class);
    }

    public function siswas()
    {
        return $this->hasMany(Siswa::class);
    }

    public function kelasList()
    {
        return $this->hasMany(Kelas::class);
    }

    public function fasilitas()
    {
        return $this->hasMany(Fasilitas::class);
    }

    public function kebutuhans()
    {
        return $this->hasMany(Kebutuhan::class);
    }

    public function pengirimanBantuans()
    {
        return $this->hasMany(PengirimanBantuan::class);
    }
}
