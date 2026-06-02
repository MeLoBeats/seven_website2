<?php

use App\Models\User;

test('admin routes are blocked for invite users', function () {
    $user = User::factory()->create(['role' => 'invite']);

    $this->actingAs($user)->get('/admin/users')->assertForbidden();
    $this->actingAs($user)->get('/admin/items')->assertForbidden();
});

test('admin routes are accessible for admin users', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin/users')->assertOk();
    $this->actingAs($admin)->get('/admin/items')->assertOk();
});

test('admin routes redirect guests to login', function () {
    $this->get('/admin/users')->assertRedirect('/login');
    $this->get('/admin/items')->assertRedirect('/login');
});