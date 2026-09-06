<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sekolahs', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('npsn')->unique();
            $table->string('akreditasi')->nullable();
            $table->string('status_sekolah')->default('Negeri');
            $table->string('jenjang')->nullable();
            $table->string('kepala_sekolah')->nullable();
            $table->string('nip_kepsek')->nullable();
            $table->string('operator')->nullable();
            $table->text('alamat')->nullable();
            $table->string('wilayah')->nullable();
            $table->string('kode_pos')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('kurikulum')->nullable();
            // Stats fields
            $table->integer('total_siswa')->default(0);
            $table->string('trend_siswa')->nullable();
            $table->integer('total_guru')->default(0);
            $table->string('trend_guru')->nullable();
            $table->integer('total_kelas')->default(0);
            $table->string('trend_kelas')->nullable();
            $table->string('tingkat_kehadiran')->nullable();
            $table->string('trend_kehadiran')->nullable();
            $table->integer('lab_komputer')->default(0);
            $table->integer('lab_ipa')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sekolahs');
    }
};
