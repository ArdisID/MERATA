<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fasilitas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sekolah_id')->nullable()->constrained('sekolahs')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., FAS-001
            $table->string('nama');
            $table->string('lokasi')->nullable();
            $table->string('kondisi')->default('Baik'); // Baik, Rusak Ringan, Rusak Berat
            $table->string('kondisi_badge')->nullable();
            $table->integer('jumlah_total')->default(0);
            $table->integer('jumlah_baik')->default(0);
            $table->integer('jumlah_rusak')->default(0);
            $table->text('keterangan')->nullable();
            $table->text('kebutuhan_tambahan')->nullable();
            $table->string('terakhir_cek')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fasilitas');
    }
};
