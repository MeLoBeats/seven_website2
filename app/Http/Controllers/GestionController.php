<?php

namespace App\Http\Controllers;

use App\Models\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GestionController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('gestion', [
            'phoneNumbers' => $request->user()->phoneNumbers()->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username,'.$request->user()->id],
            'groupe' => ['required', 'string', 'max:255'],
            'photo_profil' => ['nullable', 'image', 'max:2048'],
        ]);

        $data = [
            'username' => $request->username,
            'name' => $request->username,
            'groupe' => $request->groupe,
        ];

        if ($request->hasFile('photo_profil')) {
            if ($request->user()->photo_profil) {
                Storage::disk('public')->delete($request->user()->photo_profil);
            }
            $data['photo_profil'] = $request->file('photo_profil')->store('avatars', 'public');
        }

        $request->user()->update($data);

        return back()->with('success', 'Profil mis à jour.');
    }

    public function addPhone(Request $request): RedirectResponse
    {
        $request->validate([
            'numero' => ['required', 'string', 'max:20'],
            'label' => ['nullable', 'string', 'max:50'],
        ]);

        $request->user()->phoneNumbers()->create([
            'numero' => $request->numero,
            'label' => $request->label,
        ]);

        return back()->with('success', 'Numéro ajouté.');
    }

    public function deletePhone(Request $request, PhoneNumber $phoneNumber): RedirectResponse
    {
        if ($phoneNumber->user_id !== $request->user()->id) {
            abort(403);
        }

        $phoneNumber->delete();

        return back()->with('success', 'Numéro supprimé.');
    }
}