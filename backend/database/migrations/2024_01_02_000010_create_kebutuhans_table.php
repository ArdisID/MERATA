<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kebutuhans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sekolah_id')->nullable()->constrained('sekolahs')->nullOnDelete();
            $table->foreignId('guru_id')->nullable()->constrained('gurus')->nullOnDelete();
            $table->string('kode')->unique(); // e.g., VRF-001 or TND-01
            $table->string('judul');
            $table->string('kategori')->nullable();
            $table->string('pemohon')->nullable();
            $table->string('peran_pemohon')->nullable();
            $table->string('tanggal')->nullable();
            $table->string('urgensi')->default('Sedang'); // Mendesak, Sedang, Rendah
            $table->string('urgensi_badge')->nullable();
            $table->string('estimasi_biaya')->nullable();
            $table->text('justifikasi')->nullable();
            $table->string('status')->default('menunggu'); // menunggu, disetujui_sekolah, diteruskan_pemda, disetujui_pemda, ditolak, revisi
            $table->string('status_label')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->string('lampiran')->nullable();
            // For guru's own needs tracking (TND type)
            $table->string('tipe')->default('verifikasi'); // verifikasi or kebutuhan_guru
            $table->string('biaya')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kebutuhans');
    }
};
