<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use Inertia\Response;

class VenteController extends Controller
{
    public function index(): Response
    {
        $items = Item::with('tags')
            ->whereIn('type', ['achat', 'les_deux'])
            ->get()
            ->map(fn (Item $item) => [
                'id' => $item->id,
                'nom' => $item->nom,
                'description' => $item->description,
                'prix_achat' => $item->prix_achat,
                'stock' => $item->stock,
                'image_url' => $item->image_url,
                'tags' => $item->tags->map(fn ($tag) => ['nom' => $tag->nom, 'couleur' => $tag->couleur]),
            ]);

        return Inertia::render('vente', ['items' => $items]);
    }
}