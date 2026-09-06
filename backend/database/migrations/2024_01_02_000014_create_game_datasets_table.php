<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_datasets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->nullable()->constrained('materis')->nullOnDelete();
            $table->string('tipe_game'); // matching, ordering, puzzle, tebak_cepat
            $table->string('judul')->nullable();
            $table->json('data'); // game-specific data structure
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_datasets');
    }
};
