<?php

namespace Database\Factories;

use App\Models\AffiliationCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AffiliationCode>
 */
class AffiliationCodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('????-????')),
            'is_used' => false,
            'used_by' => null,
        ];
    }
}
