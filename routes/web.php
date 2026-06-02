<?php

use App\Http\Controllers\AchatController;
use App\Http\Controllers\Admin\CommandeController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\GestionController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\VenteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/gestion', [GestionController::class, 'index'])->name('gestion');
    Route::post('/gestion', [GestionController::class, 'update'])->name('gestion.update');
    Route::post('/gestion/telephone', [GestionController::class, 'addPhone'])->name('gestion.phone.store');
    Route::delete('/gestion/telephone/{phoneNumber}', [GestionController::class, 'deletePhone'])->name('gestion.phone.destroy');

    Route::get('/achat', [AchatController::class, 'index'])->name('achat');
    Route::get('/vente', [VenteController::class, 'index'])->name('vente');

    Route::get('/panier', [PanierController::class, 'index'])->name('panier');
    Route::post('/panier/items/{item}', [PanierController::class, 'ajouter'])->name('panier.ajouter');
    Route::patch('/panier/items/{commandeItem}', [PanierController::class, 'majQuantite'])->name('panier.quantite');
    Route::delete('/panier/items/{commandeItem}', [PanierController::class, 'retirer'])->name('panier.retirer');
    Route::post('/panier/valider', [PanierController::class, 'valider'])->name('panier.valider');

    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        Route::patch('/users/{user}/role', [UserController::class, 'toggleRole'])->name('admin.users.role');

        Route::get('/commandes', [CommandeController::class, 'index'])->name('admin.commandes');
        Route::post('/commandes/{commande}/valider', [CommandeController::class, 'valider'])->name('admin.commandes.valider');
        Route::post('/commandes/{commande}/refuser', [CommandeController::class, 'refuser'])->name('admin.commandes.refuser');

        Route::get('/items', [ItemController::class, 'index'])->name('admin.items');
        Route::post('/items', [ItemController::class, 'store'])->name('admin.items.store');
        Route::post('/items/{item}', [ItemController::class, 'update'])->name('admin.items.update');
        Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('admin.items.destroy');

        Route::post('/tags', [TagController::class, 'store'])->name('admin.tags.store');
        Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('admin.tags.destroy');
    });
});

require __DIR__.'/auth.php';
