<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submateris', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->constrained('materis')->cascadeOnDelete();
            $table->integer('nomor');
            $table->string('judul');
            $table->string('durasi')->nullable();
            $table->json('tujuan')->nullable(); // array of strings
            $table->longText('materi_utama')->nullable();
            $table->json('ilustrasi')->nullable(); // {tipe, label, caption}
            $table->json('video')->nullable(); // {judul, durasi, thumbnail, deskripsiVideo}
            $table->json('contoh_soal')->nullable(); // array of {soal, jawaban, pembahasan}
            $table->json('slides')->nullable(); // array of {slideNo, judul, konten}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submateris');
    }
};
