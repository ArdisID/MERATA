<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materis', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique(); // e.g., MAT-001
            $table->string('jenjang');
            $table->string('kelas');
            $table->string('mapel');
            $table->string('topik');
            $table->integer('jumlah_submateri')->default(0);
            $table->string('author')->nullable();
            $table->string('tanggal_terbit')->nullable();
            $table->string('status')->default('Draft');
            $table->string('badge')->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materis');
    }
};
