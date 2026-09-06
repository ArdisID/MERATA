<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sekolah_id')->nullable()->constrained('sekolahs')->nullOnDelete();
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., SIS-001
            $table->string('nisn')->unique();
            $table->string('nama');
            $table->string('gender')->nullable();
            $table->string('kelas_nama')->nullable(); // denormalized: "8B"
            $table->decimal('kehadiran', 5, 2)->default(0);
            $table->string('status_kehadiran')->default('Baik');
            $table->decimal('nilai_rata_rata', 5, 2)->default(0);
            $table->string('status_bantuan')->nullable();
            $table->string('bantuan_badge')->nullable();
            $table->text('kebutuhan')->nullable();
            $table->text('catatan')->nullable();
            $table->json('riwayat_bantuan')->nullable(); // array of {tahun, jenis, nilai, status}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};
