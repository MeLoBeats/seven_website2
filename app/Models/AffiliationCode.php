<?php

namespace App\Models;

use Database\Factories\AffiliationCodeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliationCode extends Model
{
    /** @use HasFactory<AffiliationCodeFactory> */
    use HasFactory;

    protected $fillable = ['code', 'is_used', 'used_by'];

    protected function casts(): array
    {
        return ['is_used' => 'boolean'];
    }

    public function usedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'used_by');
    }
}
