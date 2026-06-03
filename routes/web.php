<?php

use App\Http\Controllers\AchatController;
use App\Http\Controllers\Admin\AffiliationCodeController;
use App\Http\Controllers\Admin\CommandeController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DiscordActionController;
use App\Http\Controllers\GestionController;
use App\Http\Controllers\PanierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Routes Discord (liens signés, pas d'auth requise)
Route::get('/discord/commande/{commande}/valider', [DiscordActionController::class, 'valider'])->name('discord.valider');
Route::get('/discord/commande/{commande}/refuser', [DiscordActionController::class, 'refuser'])->name('discord.refuser');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/gestion', [GestionController::class, 'index'])->name('gestion');
    Route::post('/gestion', [GestionController::class, 'update'])->name('gestion.update');
    Route::post('/gestion/telephone', [GestionController::class, 'addPhone'])->name('gestion.phone.store');
    Route::delete('/gestion/telephone/{phoneNumber}', [GestionController::class, 'deletePhone'])->name('gestion.phone.destroy');

    Route::get('/achat', [AchatController::class, 'index'])->name('achat');

    Route::get('/panier', [PanierController::class, 'index'])->name('panier');
    Route::post('/panier/items/{item}', [PanierController::class, 'ajouter'])->name('panier.ajouter');
    Route::patch('/panier/items/{commandeItem}', [PanierController::class, 'majQuantite'])->name('panier.quantite');
    Route::delete('/panier/items/{commandeItem}', [PanierController::class, 'retirer'])->name('panier.retirer');
    Route::post('/panier/valider', [PanierController::class, 'valider'])->name('panier.valider');

    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        Route::patch('/users/{user}/role', [UserController::class, 'toggleRole'])->name('admin.users.role');

        Route::get('/codes', [AffiliationCodeController::class, 'index'])->name('admin.codes');
        Route::post('/codes', [AffiliationCodeController::class, 'store'])->name('admin.codes.store');
        Route::delete('/codes/{affiliationCode}', [AffiliationCodeController::class, 'destroy'])->name('admin.codes.destroy');

        Route::get('/commandes', [CommandeController::class, 'index'])->name('admin.commandes');
        Route::post('/commandes/{commande}/valider', [CommandeController::class, 'valider'])->name('admin.commandes.valider');
        Route::post('/commandes/{commande}/refuser', [CommandeController::class, 'refuser'])->name('admin.commandes.refuser');

        Route::get('/items', [ItemController::class, 'index'])->name('admin.items');
        Route::post('/items', [ItemController::class, 'store'])->name('admin.items.store');
        Route::post('/items/{item}', [ItemController::class, 'update'])->name('admin.items.update');
        Route::patch('/items/{item}/actif', [ItemController::class, 'toggleActif'])->name('admin.items.actif');
        Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('admin.items.destroy');

        Route::post('/tags', [TagController::class, 'store'])->name('admin.tags.store');
        Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('admin.tags.destroy');
    });
});

require __DIR__.'/auth.php';
