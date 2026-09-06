<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->nullable()->constrained('materis')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., QZ-PEC-01
            $table->string('judul');
            $table->string('topik')->nullable();
            $table->integer('durasi_menit')->default(10);
            $table->integer('kkm')->default(75);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
