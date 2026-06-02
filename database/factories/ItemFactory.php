<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['achat', 'vente', 'les_deux']);

        return [
            'nom' => fake()->randomElement(['Kéta', 'Opioïdes', 'Weed', 'Crack', 'MDMA', 'Coke', 'Meth', 'Arme de poing', 'Fusil']),
            'description' => fake()->optional()->sentence(),
            'prix_achat' => $type !== 'vente' ? fake()->numberBetween(100, 5000) : null,
            'prix_vente' => $type !== 'achat' ? fake()->numberBetween(200, 8000) : null,
            'stock' => fake()->numberBetween(0, 50),
            'type' => $type,
            'image' => null,
        ];
    }
}
