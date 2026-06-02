<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommandeItem extends Model
{
    protected $fillable = ['commande_id', 'item_id', 'quantite', 'prix_unitaire'];

    protected function casts(): array
    {
        return [
            'prix_unitaire' => 'decimal:2',
            'quantite' => 'integer',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
