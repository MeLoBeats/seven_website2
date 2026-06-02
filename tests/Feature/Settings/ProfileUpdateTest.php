<?php

use App\Models\User;

test('phone numbers can be added', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/gestion/telephone', [
            'numero' => '555-1234',
            'label' => 'Principal',
        ]);

    $response->assertRedirect();
    expect($user->phoneNumbers()->count())->toBe(1);
    expect($user->phoneNumbers()->first()->numero)->toBe('555-1234');
});

test('phone numbers can be deleted', function () {
    $user = User::factory()->create();
    $phone = $user->phoneNumbers()->create(['numero' => '555-9999', 'label' => 'Backup']);

    $response = $this->actingAs($user)->delete("/gestion/telephone/{$phone->id}");

    $response->assertRedirect();
    expect($user->phoneNumbers()->count())->toBe(0);
});

test('users cannot delete another user phone number', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();
    $phone = $userA->phoneNumbers()->create(['numero' => '555-1111', 'label' => null]);

    $this->actingAs($userB)->delete("/gestion/telephone/{$phone->id}")->assertForbidden();

    expect($userA->phoneNumbers()->count())->toBe(1);
});

test('groupe can be updated on gestion page', function () {
    $user = User::factory()->create(['groupe' => 'Vespucci']);

    $response = $this
        ->actingAs($user)
        ->post('/gestion', [
            'username' => $user->username,
            'groupe' => 'Sandy Shores',
        ]);

    $response->assertSessionHasNoErrors();
    expect($user->refresh()->groupe)->toBe('Sandy Shores');
});