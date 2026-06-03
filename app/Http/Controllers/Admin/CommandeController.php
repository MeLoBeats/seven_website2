<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommandeController extends Controller
{
    public function index(Request $request): Response
    {
        $periode = $request->input('periode', 'tout');
        $groupe = $request->input('groupe');

        $baseQuery = Commande::with(['user', 'items.item'])
            ->whereIn('statut', ['en_attente', 'validee', 'refusee']);

        // Filtre période
        $baseQuery->when($periode === 'today', fn ($q) => $q->whereDate('created_at', today()))
            ->when($periode === 'week', fn ($q) => $q->where('created_at', '>=', now()->startOfWeek()))
            ->when($periode === 'month', fn ($q) => $q->where('created_at', '>=', now()->startOfMonth()));

        // Filtre groupe
        $baseQuery->when($groupe, fn ($q) => $q->whereHas('user', fn ($u) => $u->where('groupe', $groupe)));

        $commandes = $baseQuery->latest()->get()->map(fn (Commande $c) => [
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

        // Stats agrégées (sur les commandes validées uniquement, selon filtres)
        $validees = $commandes->where('statut', 'validee');
        $stats = [
            'total_rachete' => $validees->sum('total'),
            'nb_validees' => $validees->count(),
            'nb_en_attente' => $commandes->where('statut', 'en_attente')->count(),
            'nb_refusees' => $commandes->where('statut', 'refusee')->count(),
        ];

        // Liste des groupes pour le filtre
        $groupes = User::whereNotNull('groupe')->distinct()->pluck('groupe')->sort()->values();

        return Inertia::render('admin/commandes', [
            'commandes' => $commandes->values(),
            'nb_en_attente' => Commande::where('statut', 'en_attente')->count(),
            'stats' => $stats,
            'groupes' => $groupes,
            'filters' => ['periode' => $periode, 'groupe' => $groupe],
        ]);
    }

    public function valider(Request $request, Commande $commande): RedirectResponse
    {
        $request->validate(['note_admin' => ['nullable', 'string', 'max:500']]);
        $commande->update(['statut' => 'validee', 'note_admin' => $request->note_admin]);

        return back()->with('success', 'Commande validée.');
    }

    public function refuser(Request $request, Commande $commande): RedirectResponse
    {
        $request->validate(['note_admin' => ['nullable', 'string', 'max:500']]);
        $commande->update(['statut' => 'refusee', 'note_admin' => $request->note_admin]);

        return back()->with('success', 'Commande refusée.');
    }

    public function destroy(Commande $commande): RedirectResponse
    {
        $commande->delete();

        return back()->with('success', 'Commande supprimée.');
    }
}
