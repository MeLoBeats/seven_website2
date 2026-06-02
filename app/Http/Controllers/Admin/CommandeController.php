<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommandeController extends Controller
{
    public function index(): Response
    {
        $commandes = Commande::with(['user', 'items.item'])
            ->whereIn('statut', ['en_attente', 'validee', 'refusee'])
            ->latest()
            ->get()
            ->map(fn (Commande $c) => [
                'id' => $c->id,
                'statut' => $c->statut,
                'note' => $c->note,
                'note_admin' => $c->note_admin,
                'created_at' => $c->created_at->format('d/m/Y H:i'),
                'user' => [
                    'username' => $c->user->username,
                    'groupe' => $c->user->groupe,
                    'photo_profil_url' => $c->user->photo_profil_url,
                    'phone_numbers' => $c->user->phoneNumbers->map(fn ($p) => ['numero' => $p->numero, 'label' => $p->label]),
                ],
                'items' => $c->items->map(fn ($ci) => [
                    'nom' => $ci->item->nom,
                    'quantite' => $ci->quantite,
                    'prix_unitaire' => $ci->prix_unitaire,
                ]),
                'total' => $c->total(),
            ]);

        return Inertia::render('admin/commandes', [
            'commandes' => $commandes,
            'nb_en_attente' => Commande::where('statut', 'en_attente')->count(),
        ]);
    }

    public function valider(Request $request, Commande $commande): RedirectResponse
    {
        $request->validate([
            'note_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $commande->update(['statut' => 'validee', 'note_admin' => $request->note_admin]);

        return back()->with('success', 'Commande validée.');
    }

    public function refuser(Request $request, Commande $commande): RedirectResponse
    {
        $request->validate([
            'note_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $commande->update(['statut' => 'refusee', 'note_admin' => $request->note_admin]);

        return back()->with('success', 'Commande refusée.');
    }
}
