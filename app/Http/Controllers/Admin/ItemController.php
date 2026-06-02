<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(): Response
    {
        $items = Item::with('tags')->latest()->get()->map(fn (Item $item) => [
            'id' => $item->id,
            'nom' => $item->nom,
            'description' => $item->description,
            'prix_achat' => $item->prix_achat,
            'prix_vente' => $item->prix_vente,
            'stock' => $item->stock,
            'type' => $item->type,
            'image_url' => $item->image_url,
            'tags' => $item->tags->map(fn ($tag) => ['id' => $tag->id, 'nom' => $tag->nom, 'couleur' => $tag->couleur]),
        ]);

        $tags = Tag::all()->map(fn ($tag) => ['id' => $tag->id, 'nom' => $tag->nom, 'couleur' => $tag->couleur]);

        return Inertia::render('admin/items', [
            'items' => $items,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'prix_achat' => ['nullable', 'numeric', 'min:0'],
            'prix_vente' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'type' => ['required', 'in:achat,vente,les_deux'],
            'image' => ['nullable', 'image', 'max:2048'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ]);

        $data = $request->only(['nom', 'description', 'prix_achat', 'prix_vente', 'stock', 'type']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('items', 'public');
        }

        $item = Item::create($data);

        if ($request->tags) {
            $item->tags()->sync($request->tags);
        }

        return back()->with('success', 'Article créé.');
    }

    public function update(Request $request, Item $item): RedirectResponse
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'prix_achat' => ['nullable', 'numeric', 'min:0'],
            'prix_vente' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'type' => ['required', 'in:achat,vente,les_deux'],
            'image' => ['nullable', 'image', 'max:2048'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ]);

        $data = $request->only(['nom', 'description', 'prix_achat', 'prix_vente', 'stock', 'type']);

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $data['image'] = $request->file('image')->store('items', 'public');
        }

        $item->update($data);
        $item->tags()->sync($request->tags ?? []);

        return back()->with('success', 'Article mis à jour.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        return back()->with('success', 'Article supprimé.');
    }
}