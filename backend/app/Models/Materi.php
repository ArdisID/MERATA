<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode', 'jenjang', 'kelas', 'mapel', 'topik',
        'jumlah_submateri', 'author', 'tanggal_terbit',
        'status', 'badge', 'deskripsi',
    ];

    public function submateris()
    {
        return $this->hasMany(Submateri::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function gameDatasets()
    {
        return $this->hasMany(GameDataset::class);
    }
}
