<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submateris', function (Blueprint $table) {
            $table->string('video_url')->nullable()->after('video');       // Uploaded video file URL
            $table->string('ppt_url')->nullable()->after('video_url');     // Uploaded PPT/PDF slide URL
            $table->string('ppt_filename')->nullable()->after('ppt_url'); // Original PPT filename
        });
    }

    public function down(): void
    {
        Schema::table('submateris', function (Blueprint $table) {
            $table->dropColumn(['video_url', 'ppt_url', 'ppt_filename']);
        });
    }
};
