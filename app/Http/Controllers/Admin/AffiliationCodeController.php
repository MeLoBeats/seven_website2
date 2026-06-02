<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AffiliationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AffiliationCodeController extends Controller
{
    public function index(): Response
    {
        $codes = AffiliationCode::with('usedByUser')
            ->latest()
            ->get()
            ->map(fn (AffiliationCode $c) => [
                'id' => $c->id,
                'code' => $c->code,
                'is_used' => $c->is_used,
                'used_by_username' => $c->usedByUser?->username,
                'created_at' => $c->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('admin/codes', [
            'codes' => $codes,
            'nb_disponibles' => $codes->where('is_used', false)->count(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['nullable', 'string', 'max:50', 'unique:affiliation_codes,code'],
        ]);

        $code = $request->filled('code')
            ? strtoupper(trim($request->code))
            : strtoupper(Str::random(4).'-'.Str::random(4));

        AffiliationCode::create(['code' => $code]);

        return back()->with('success', "Code $code créé.");
    }

    public function destroy(AffiliationCode $affiliationCode): RedirectResponse
    {
        if ($affiliationCode->is_used) {
            return back()->withErrors(['code' => 'Impossible de supprimer un code déjà utilisé.']);
        }

        $affiliationCode->delete();

        return back()->with('success', 'Code supprimé.');
    }
}
