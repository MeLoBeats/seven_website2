<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AffiliationCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'groupe' => ['required', 'string', 'max:255'],
            'code_affiliation' => ['required', 'string', function ($attribute, $value, $fail): void {
                $valid = AffiliationCode::where('code', $value)->where('is_used', 0)->exists();
                if (! $valid) {
                    $fail('Code d\'affiliation invalide ou déjà utilisé.');
                }
            }],
        ]);

        $code = AffiliationCode::where('code', $request->code_affiliation)
            ->where('is_used', false)
            ->firstOrFail();

        $user = User::create([
            'username' => $request->username,
            'name' => $request->username,
            'password' => $request->password,
            'groupe' => $request->groupe,
            'role' => 'invite',
        ]);

        $code->update(['is_used' => true, 'used_by' => $user->id]);

        Auth::login($user);

        return to_route('gestion');
    }
}
