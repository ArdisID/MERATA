<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengiriman_bantuans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sekolah_id')->nullable()->constrained('sekolahs')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., SHP-001
            $table->string('program');
            $table->string('sumber_dana')->nullable();
            $table->string('tahap')->default('Diajukan'); // Diajukan, Diverifikasi, Disetujui, Disalurkan, Diterima
            $table->integer('tahap_index')->default(1);
            $table->string('jumlah_item')->nullable();
            $table->string('ekspedisi')->nullable();
            $table->string('status_kondisi')->nullable();
            $table->string('tanggal_kirim')->nullable();
            $table->string('estimasi_tiba')->nullable();
            $table->string('penerima')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengiriman_bantuans');
    }
};
