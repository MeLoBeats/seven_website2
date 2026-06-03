<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class ItemsSeeder extends Seeder
{
    public function run(): void
    {
        Item::query()->delete();
        Tag::query()->delete();

        // Tags
        $antiquite = Tag::create(['nom' => 'Antiquité', 'couleur' => '#c8a96e']);
        $alcool = Tag::create(['nom' => 'Alcool',    'couleur' => '#8b1a1a']);
        $mystere = Tag::create(['nom' => 'Mystère',   'couleur' => '#7b2fbf']);
        $musique = Tag::create(['nom' => 'Musique',   'couleur' => '#1a6ea8']);
        $divers = Tag::create(['nom' => 'Divers',    'couleur' => '#4a4a4a']);
        $premium = Tag::create(['nom' => 'Premium',   'couleur' => '#cc0000']);

        // Items — type 'achat' = Seven rachète cet article
        $items = [
            [
                'nom' => 'Tableau',
                'description' => 'Œuvre d\'art, tableau de valeur.',
                'prix_achat' => 200,
                'tags' => [$antiquite, $premium],
            ],
            [
                'nom' => 'Oeuf de Fabergé',
                'description' => 'Œuf ornemental de grande valeur.',
                'prix_achat' => 320,
                'tags' => [$antiquite, $premium],
            ],
            [
                'nom' => 'Absinthe',
                'description' => 'Bouteille d\'absinthe.',
                'prix_achat' => 45,
                'tags' => [$alcool],
            ],
            [
                'nom' => 'Bouteille Vin Rouge',
                'description' => 'Bouteille de vin rouge de qualité.',
                'prix_achat' => 125,
                'tags' => [$alcool],
            ],
            [
                'nom' => 'Clé Ancienne',
                'description' => 'Vieille clé dont l\'origine est inconnue.',
                'prix_achat' => 3,
                'tags' => [$antiquite],
            ],
            [
                'nom' => 'Statue Falcolm',
                'description' => 'Statue représentant un faucon.',
                'prix_achat' => 125,
                'tags' => [$antiquite],
            ],
            [
                'nom' => 'Fiole Mystère',
                'description' => 'Contenu inconnu. À vos risques et périls.',
                'prix_achat' => 10,
                'tags' => [$mystere],
            ],
            [
                'nom' => 'Album CD',
                'description' => 'Album musical en format CD.',
                'prix_achat' => 13,
                'tags' => [$musique],
            ],
            [
                'nom' => 'Poupée Voodoo',
                'description' => 'Poupée artisanale aux propriétés douteuses.',
                'prix_achat' => 35,
                'tags' => [$mystere, $divers],
            ],
            [
                'nom' => 'Poids Muscu',
                'description' => 'Poids de musculation.',
                'prix_achat' => 125,
                'tags' => [$divers],
            ],
            [
                'nom' => 'Culotte',
                'description' => 'Sous-vêtement féminin.',
                'prix_achat' => 12,
                'tags' => [$divers],
            ],
            [
                'nom' => 'Chaîne Hi-Fi',
                'description' => 'Système audio de salon.',
                'prix_achat' => 60,
                'tags' => [$musique, $divers],
            ],
            [
                'nom' => 'Ventilateur',
                'description' => 'Ventilateur électrique.',
                'prix_achat' => 22,
                'tags' => [$divers],
            ],
            [
                'nom' => 'Chicha',
                'description' => 'Narguilé, pipe à eau.',
                'prix_achat' => 12,
                'tags' => [$divers],
            ],
            [
                'nom' => 'Buste Grec',
                'description' => 'Réplique d\'un buste de l\'antiquité grecque.',
                'prix_achat' => 125,
                'tags' => [$antiquite],
            ],
        ];

        foreach ($items as $data) {
            $tags = $data['tags'];
            unset($data['tags']);

            $item = Item::create(array_merge($data, [
                'prix_vente' => null,
                'stock' => 0,
                'type' => 'achat',
            ]));

            $item->tags()->attach(array_map(fn ($t) => $t->id, $tags));
        }

        $this->command->info('✓ 15 articles Seven créés.');
    }
}
