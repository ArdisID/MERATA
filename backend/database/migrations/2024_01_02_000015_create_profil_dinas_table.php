<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profil_dinas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('nama');
            $table->string('nip')->nullable();
            $table->string('instansi');
            $table->string('jabatan');
            $table->string('wilayah_kerja');
            $table->string('email')->nullable();
            $table->string('telepon')->nullable();
            $table->text('avatar')->nullable();
            $table->text('alamat_kantor')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profil_dinas');
    }
};
