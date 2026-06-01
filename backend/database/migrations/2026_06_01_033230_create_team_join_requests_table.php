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
        Schema::create('team_join_requests', function (Blueprint $table) {

    $table->id();

    $table->foreignId('team_id')->constrained()->cascadeOnDelete();

    $table->foreignId('user_id')->constrained()->cascadeOnDelete();

    $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])
        ->default('PENDING');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_join_requests');
    }
};
