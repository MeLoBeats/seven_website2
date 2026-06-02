<?php

use App\Models\User;

test('username can be updated on gestion page', function () {
    $user = User::factory()->create(['username' => 'old_name']);

    $response = $this
        ->actingAs($user)
        ->post('/gestion', [
            'username' => 'new_name',
            'groupe' => $user->groupe,
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect();

    expect($user->refresh()->username)->toBe('new_name');
});

test('username must be unique on update', function () {
    $other = User::factory()->create(['username' => 'taken_name']);
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/gestion', [
            'username' => 'taken_name',
            'groupe' => 'Los Santos',
        ]);

    $response->assertSessionHasErrors('username');
    expect($user->refresh()->username)->not->toBe('taken_name');
});