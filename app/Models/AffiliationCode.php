<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffiliationCode extends Model
{
    /** @use HasFactory<\Database\Factories\AffiliationCodeFactory> */
    use HasFactory;

    protected $fillable = ['code', 'is_used', 'used_by'];

    protected function casts(): array
    {
        return ['is_used' => 'boolean'];
    }
}
