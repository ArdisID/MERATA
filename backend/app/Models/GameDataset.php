<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameDataset extends Model
{
    use HasFactory;

    protected $fillable = [
        'materi_id', 'tipe_game', 'judul', 'data',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    public function materi()
    {
        return $this->belongsTo(Materi::class);
    }
}
