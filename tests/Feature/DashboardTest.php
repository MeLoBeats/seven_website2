<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/gestion')->assertRedirect('/login');
});

test('authenticated users can visit the gestion page', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/gestion')->assertOk();
});

test('achat page is accessible to authenticated users', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/achat')->assertOk();
});

test('vente page is accessible to authenticated users', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/vente')->assertOk();
});