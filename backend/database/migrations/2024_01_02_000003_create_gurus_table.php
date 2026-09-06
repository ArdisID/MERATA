<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gurus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sekolah_id')->nullable()->constrained('sekolahs')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., GUR-001
            $table->string('nip')->nullable();
            $table->string('nama');
            $table->string('gender')->nullable();
            $table->string('mapel')->nullable();
            $table->json('kelas_ajar')->nullable(); // array of class codes
            $table->string('jabatan')->nullable();
            $table->string('status_kepegawaian')->nullable(); // PNS, PPPK, Honorer
            $table->string('sertifikasi')->nullable();
            $table->string('pendidikan')->nullable();
            $table->string('lama_mengajar')->nullable();
            $table->integer('poin_kontribusi')->default(0);
            $table->text('kebutuhan')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gurus');
    }
};
