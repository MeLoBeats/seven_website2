<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('phoneNumbers')
            ->latest()
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'username' => $user->username,
                'groupe' => $user->groupe,
                'role' => $user->role,
                'photo_profil_url' => $user->photo_profil_url,
                'phone_numbers' => $user->phoneNumbers->map(fn ($p) => ['numero' => $p->numero, 'label' => $p->label]),
                'created_at' => $user->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('admin/users', ['users' => $users]);
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            abort(403);
        }

        $user->delete();

        return back()->with('success', 'Utilisateur supprimé.');
    }

    public function toggleRole(User $user): RedirectResponse
    {
        $user->update([
            'role' => $user->isAdmin() ? 'invite' : 'admin',
        ]);

        return back()->with('success', 'Rôle mis à jour.');
    }
}
