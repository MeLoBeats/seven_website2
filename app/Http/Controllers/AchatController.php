<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use Inertia\Response;

class AchatController extends Controller
{
    public function index(): Response
    {
        $items = Item::with('tags')
            ->whereIn('type', ['vente', 'les_deux'])
            ->where('stock', '>', 0)
            ->get()
            ->map(fn (Item $item) => [
                'id' => $item->id,
                'nom' => $item->nom,
                'description' => $item->description,
                'prix_vente' => $item->prix_vente,
                'stock' => $item->stock,
                'image_url' => $item->image_url,
                'tags' => $item->tags->map(fn ($tag) => ['nom' => $tag->nom, 'couleur' => $tag->couleur]),
            ]);

        return Inertia::render('achat', ['items' => $items]);
    }
}