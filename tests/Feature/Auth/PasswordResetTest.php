<?php

use App\Models\AffiliationCode;
use App\Models\User;

test('affiliation code is marked as used after registration', function () {
    $code = AffiliationCode::factory()->create();

    $this->post('/register', [
        'username' => 'newuser',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'groupe' => 'Los Santos',
        'code_affiliation' => $code->code,
    ]);

    expect($code->fresh()->is_used)->toBeTrue();
    expect($code->fresh()->used_by)->not->toBeNull();
});

test('used affiliation code cannot be reused', function () {
    $code = AffiliationCode::factory()->create(['is_used' => true]);

    $response = $this->post('/register', [
        'username' => 'anotheruser',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'groupe' => 'Los Santos',
        'code_affiliation' => $code->code,
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('code_affiliation');
});

test('duplicate username is rejected on registration', function () {
    $existing = User::factory()->create(['username' => 'taken_name']);
    $code = AffiliationCode::factory()->create();

    $response = $this->post('/register', [
        'username' => 'taken_name',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'groupe' => 'Los Santos',
        'code_affiliation' => $code->code,
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('username');
});