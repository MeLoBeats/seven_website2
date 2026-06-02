<?php

namespace Database\Seeders;

use App\Models\AffiliationCode;
use App\Models\Item;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account
        User::factory()->admin()->create([
            'username' => 'seven_admin',
            'name' => 'seven_admin',
            'groupe' => 'Seven',
        ]);

        // Test invite account (uses an affiliation code below)
        User::factory()->create([
            'username' => 'invite_test',
            'name' => 'invite_test',
        ]);

        // Affiliation codes — share these with partners
        AffiliationCode::factory()->count(20)->create();

        // A few pre-known codes for easy testing
        AffiliationCode::create(['code' => 'SEVEN-2025', 'is_used' => false]);
        AffiliationCode::create(['code' => 'GANG-ACCES', 'is_used' => false]);

        // Tags
        $tags = collect([
            ['nom' => 'Drogue', 'couleur' => '#cc0000'],
            ['nom' => 'Arme', 'couleur' => '#ff6600'],
            ['nom' => 'Premium', 'couleur' => '#00ff41'],
            ['nom' => 'Rare', 'couleur' => '#aa00ff'],
            ['nom' => 'Gros volume', 'couleur' => '#ffaa00'],
        ])->map(fn ($data) => Tag::create($data));

        // Sample items
        $itemsData = [
            ['nom' => 'Kéta', 'description' => 'Kétamine de haute qualité.', 'prix_achat' => 800, 'prix_vente' => 1200, 'stock' => 30, 'type' => 'les_deux', 'tag' => 'Drogue'],
            ['nom' => 'Weed', 'description' => 'Cannabis premium. Stock limité.', 'prix_achat' => 200, 'prix_vente' => 350, 'stock' => 50, 'type' => 'les_deux', 'tag' => 'Drogue'],
            ['nom' => 'Coke', 'description' => 'Cocaïne pure, import direct.', 'prix_achat' => 2000, 'prix_vente' => 3500, 'stock' => 15, 'type' => 'les_deux', 'tag' => 'Drogue'],
            ['nom' => 'MDMA', 'description' => 'Ecstasy — pilules bleues.', 'prix_achat' => 600, 'prix_vente' => 900, 'stock' => 25, 'type' => 'les_deux', 'tag' => 'Drogue'],
            ['nom' => 'Meth', 'description' => 'Crystal meth, production locale.', 'prix_achat' => 1500, 'prix_vente' => 2800, 'stock' => 8, 'type' => 'les_deux', 'tag' => 'Drogue'],
            ['nom' => 'Glock 17', 'description' => 'Pistolet semi-auto 9mm.', 'prix_achat' => 5000, 'prix_vente' => 8500, 'stock' => 5, 'type' => 'vente', 'tag' => 'Arme'],
            ['nom' => 'AK-47', 'description' => 'Fusil d\'assaut, chargeur 30 coups.', 'prix_achat' => 15000, 'prix_vente' => 25000, 'stock' => 2, 'type' => 'vente', 'tag' => 'Arme'],
            ['nom' => 'Opioïdes', 'description' => 'Rachat uniquement. Bon prix garanti.', 'prix_achat' => 400, 'prix_vente' => null, 'stock' => 0, 'type' => 'achat', 'tag' => 'Drogue'],
        ];

        foreach ($itemsData as $data) {
            $tagNom = $data['tag'];
            unset($data['tag']);
            $item = Item::create($data);
            $tag = $tags->firstWhere('nom', $tagNom);
            if ($tag) {
                $item->tags()->attach($tag->id);
            }
        }
    }
}