<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id', 'nomor', 'pertanyaan', 'opsi', 'kunci', 'penjelasan',
    ];

    protected function casts(): array
    {
        return [
            'opsi' => 'array',
        ];
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
