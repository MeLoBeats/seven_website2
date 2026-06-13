<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\CommandeItem;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

        if (! in_array($item->type, ['achat', 'les_deux'])) {
            abort(422, 'Article non disponible au rachat.');
        }

        $quantite = max(1, (int) $request->quantite);

        $panier = $this->getPanier($request->user()->id);

        $ligne = $panier->items()->where('item_id', $item->id)->first();

        if ($ligne) {
            $ligne->update(['quantite' => $ligne->quantite + $quantite]);
        } else {
            $panier->items()->create([
                'item_id' => $item->id,
                'quantite' => $quantite,
                'prix_unitaire' => $item->prix_achat,
            ]);
        }

        return back()->with('success', 'Article ajouté au panier.');
    }

    public function majQuantite(Request $request, CommandeItem $commandeItem): RedirectResponse
    {
        if ($commandeItem->commande->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate(['quantite' => ['required', 'integer', 'min:1']]);

        $max = $commandeItem->item->stock;
        $commandeItem->update(['quantite' => min((int) $request->quantite, $max)]);

        return back();
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

        $panier->load('items.item', 'user');
        $this->notifierDiscord($panier);

        return to_route('achat')->with('success', 'Commande envoyée ! Un admin va la traiter.');
    }

    private function notifierDiscord(Commande $commande): void
    {
        $webhookUrl = config('services.discord.webhook_url');

        if (! $webhookUrl) {
            return;
        }

        $user = $commande->user;
        $total = $commande->items->sum(fn ($i) => $i->prix_unitaire * $i->quantite);

        $lignes = $commande->items->map(
            fn ($ci) => "• **{$ci->item->nom}** x{$ci->quantite} — \${$ci->prix_unitaire}"
        )->join("\n");

        $commandesUrl = config('app.url').'/admin/commandes';

        $payload = [
            'content' => '<@&1502487400159510558>',
            'embeds' => [[
                'title' => '🛒 Nouvelle commande — 777 Hustler',
                'url' => $commandesUrl,
                'color' => 0xCC0000,
                'fields' => [
                    ['name' => 'Vendeur', 'value' => $user->username, 'inline' => true],
                    ['name' => 'Groupe', 'value' => $user->groupe ?? '—', 'inline' => true],
                    ['name' => 'Total estimé', 'value' => "\${$total}", 'inline' => true],
                    ['name' => 'Articles', 'value' => $lignes ?: '—', 'inline' => false],
                    ['name' => 'Note', 'value' => $commande->note ?: '—', 'inline' => false],
                ],
                'footer' => ['text' => '777 Hustler Organization • Cliquez le titre pour traiter'],
                'timestamp' => now()->toIso8601String(),
            ]],
        ];

        Http::post($webhookUrl, $payload);
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
