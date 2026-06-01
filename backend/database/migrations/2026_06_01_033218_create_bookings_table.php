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
        Schema::create('bookings', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('court_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('booking_date');

            $table->time('start_time');

            $table->time('end_time');

            $table->decimal('total_hours', 5, 2);

            $table->decimal('total_amount', 10, 2);

            $table->enum('status', [
                'PENDING',
                'CONFIRMED',
                'COMPLETED',
                'CANCELLED'
            ])->default('PENDING');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
