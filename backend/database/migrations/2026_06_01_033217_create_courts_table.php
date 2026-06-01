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
        Schema::create('courts', function (Blueprint $table) {

            $table->id();

            $table->string('court_name');

            $table->string('location');

            $table->text('description')->nullable();

            $table->decimal('price_per_hour', 10, 2);

            $table->string('image_url')->nullable();

            $table->decimal('latitude', 10, 8)->nullable();

            $table->decimal('longitude', 11, 8)->nullable();

            $table->decimal('rating', 2, 1)->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courts');
    }
};
