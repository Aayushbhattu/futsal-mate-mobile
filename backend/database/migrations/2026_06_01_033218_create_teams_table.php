<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {

            $table->id();

            $table->string('team_name');

            $table->foreignId('captain_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('skill_level', [
                'BEGINNER',
                'INTERMEDIATE',
                'ADVANCED'
            ]);

            $table->text('description')->nullable();

            $table->integer('max_players')->default(10);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
