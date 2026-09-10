<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilDinas extends Model
{
    use HasFactory;

    protected $table = 'profil_dinas';

    protected $fillable = [
        'user_id',
        'nama',
        'nip',
        'instansi',
        'jabatan',
        'wilayah_kerja',
        'email',
        'telepon',
        'avatar',
        'alamat_kantor',
        'website',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
