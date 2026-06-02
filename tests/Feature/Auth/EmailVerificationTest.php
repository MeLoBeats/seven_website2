<?php

use App\Models\User;

test('email verification routes no longer exist', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/verify-email')->assertStatus(404);
});

test('password reset routes no longer exist', function () {
    $this->get('/forgot-password')->assertStatus(404);
});

test('gestion page is accessible to authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/gestion')->assertOk();
});

test('gestion page redirects guests to login', function () {
    $this->get('/gestion')->assertRedirect('/login');
});