<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:50', 'unique:tags,nom'],
            'couleur' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);

        Tag::create($request->only(['nom', 'couleur']));

        return back()->with('success', 'Tag créé.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return back()->with('success', 'Tag supprimé.');
    }
}