<?php

use App\Models\AffiliationCode;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register with a valid affiliation code', function () {
    $code = AffiliationCode::factory()->create();

    $response = $this->post('/register', [
        'username' => 'nouveau_membre',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'groupe' => 'Los Santos',
        'code_affiliation' => $code->code,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('gestion', absolute: false));
});

test('registration fails with invalid affiliation code', function () {
    $response = $this->post('/register', [
        'username' => 'nouveau_membre',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'groupe' => 'Los Santos',
        'code_affiliation' => 'INVALID-CODE',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('code_affiliation');
});

test('registration fails with already used affiliation code', function () {
    $code = AffiliationCode::factory()->create(['is_used' => true]);

    $response = $this->post('/register', [
        'username' => 'nouveau_membre',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'groupe' => 'Los Santos',
        'code_affiliation' => $code->code,
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('code_affiliation');
});