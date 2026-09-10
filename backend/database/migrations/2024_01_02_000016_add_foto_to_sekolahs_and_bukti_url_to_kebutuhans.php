<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('sekolahs') && !Schema::hasColumn('sekolahs', 'foto')) {
            Schema::table('sekolahs', function (Blueprint $table) {
                $table->text('foto')->nullable()->after('kurikulum');
            });
        }

        if (Schema::hasTable('kebutuhans') && !Schema::hasColumn('kebutuhans', 'bukti_url')) {
            Schema::table('kebutuhans', function (Blueprint $table) {
                $table->text('bukti_url')->nullable()->after('lampiran');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('sekolahs') && Schema::hasColumn('sekolahs', 'foto')) {
            Schema::table('sekolahs', function (Blueprint $table) {
                $table->dropColumn('foto');
            });
        }

        if (Schema::hasTable('kebutuhans') && Schema::hasColumn('kebutuhans', 'bukti_url')) {
            Schema::table('kebutuhans', function (Blueprint $table) {
                $table->dropColumn('bukti_url');
            });
        }
    }
};
