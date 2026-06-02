<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commande extends Model
{
    protected $fillable = ['user_id', 'statut', 'note', 'note_admin'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CommandeItem::class);
    }

    public function total(): float
    {
        return $this->items->sum(fn ($i) => $i->prix_unitaire * $i->quantite);
    }
}
