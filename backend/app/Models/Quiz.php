<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quizzes';

    protected $fillable = [
        'materi_id', 'kode', 'judul', 'topik', 'durasi_menit', 'kkm', 'deskripsi',
    ];

    public function materi()
    {
        return $this->belongsTo(Materi::class);
    }

    public function soals()
    {
        return $this->hasMany(QuizSoal::class);
    }
}
