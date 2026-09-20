<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transfer extends Model
{
    protected $fillable = [
        'user_id',
        'from_wallet_id',
        'to_wallet_id',
        'amount',
        'transfer_date',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transfer_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fromWallet(): BelongsTo
    {
        return $this->belongsTo(
            Wallet::class,
            'from_wallet_id'
        );
    }

    public function toWallet(): BelongsTo
    {
        return $this->belongsTo(
            Wallet::class,
            'to_wallet_id'
        );
    }
}
