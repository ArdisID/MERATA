<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sekolah_id')->nullable()->constrained('sekolahs')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., KLS-7A
            $table->string('nama');
            $table->integer('tingkat');
            $table->string('ruang')->nullable();
            $table->foreignId('wali_kelas_id')->nullable()->constrained('gurus')->nullOnDelete();
            $table->string('wali_kelas_nama')->nullable(); // denormalized for convenience
            $table->integer('total_siswa')->default(0);
            $table->integer('laki_laki')->default(0);
            $table->integer('perempuan')->default(0);
            $table->string('kehadiran_rata')->nullable();
            $table->string('status')->default('Aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
