<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('username')->unique()->after('id');
            $table->string('groupe')->nullable()->after('username');
            $table->string('role')->default('invite')->after('groupe');
            $table->string('photo_profil')->nullable()->after('role');
            $table->string('email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['username', 'groupe', 'role', 'photo_profil']);
            $table->string('email')->nullable(false)->change();
        });
    }
};
