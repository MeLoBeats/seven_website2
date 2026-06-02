<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\CommandeItem;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PanierController extends Controller
{
    public function index(Request $request): Response
    {
        $panier = $this->getPanier($request->user()->id);

        return Inertia::render('panier', [
            'panier' => $this->formatPanier($panier),
        ]);
    }

    public function ajouter(Request $request, Item $item): RedirectResponse
    {
        $request->validate([
            'quantite' => ['required', 'integer', 'min:1'],
        ]);

        if (! in_array($item->type, ['vente', 'les_deux']) || $item->stock <= 0) {
            abort(422, 'Article non disponible.');
        }

        $quantite = min((int) $request->quantite, $item->stock);

        $panier = $this->getPanier($request->user()->id);

        $ligne = $panier->items()->where('item_id', $item->id)->first();

        if ($ligne) {
            $nouvelle = min($ligne->quantite + $quantite, $item->stock);
            $ligne->update(['quantite' => $nouvelle]);
        } else {
            $panier->items()->create([
                'item_id' => $item->id,
                'quantite' => $quantite,
                'prix_unitaire' => $item->prix_vente,
            ]);
        }

        return back()->with('success', 'Article ajouté au panier.');
    }

    public function retirer(Request $request, CommandeItem $commandeItem): RedirectResponse
    {
        if ($commandeItem->commande->user_id !== $request->user()->id) {
            abort(403);
        }

        $commandeItem->delete();

        return back()->with('success', 'Article retiré.');
    }

    public function valider(Request $request): RedirectResponse
    {
        $request->validate([
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $panier = $this->getPanier($request->user()->id);

        if ($panier->items()->count() === 0) {
            return back()->withErrors(['panier' => 'Votre panier est vide.']);
        }

        $panier->update([
            'statut' => 'en_attente',
            'note' => $request->note,
        ]);

        return to_route('achat')->with('success', 'Commande envoyée ! Un admin va la traiter.');
    }

    private function getPanier(int $userId): Commande
    {
        return Commande::firstOrCreate(
            ['user_id' => $userId, 'statut' => 'panier'],
        );
    }

    private function formatPanier(Commande $panier): array
    {
        return [
            'id' => $panier->id,
            'note' => $panier->note,
            'items' => $panier->items()->with('item.tags')->get()->map(fn (CommandeItem $ci) => [
                'id' => $ci->id,
                'quantite' => $ci->quantite,
                'prix_unitaire' => $ci->prix_unitaire,
                'item' => [
                    'id' => $ci->item->id,
                    'nom' => $ci->item->nom,
                    'image_url' => $ci->item->image_url,
                    'stock' => $ci->item->stock,
                    'tags' => $ci->item->tags->map(fn ($t) => ['nom' => $t->nom, 'couleur' => $t->couleur]),
                ],
            ]),
        ];
    }
}
