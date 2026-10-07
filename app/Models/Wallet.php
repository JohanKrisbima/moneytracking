<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(
            Transfer::class,
            'from_wallet_id'
        );
    }

    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(
            Transfer::class,
            'to_wallet_id'
        );
    }

    protected $appends = ['balance'];

    public function getBalanceAttribute(): float
    {
        $income = (float) $this->transactions()->where('type', 'income')->sum('amount');
        $expense = (float) $this->transactions()->where('type', 'expense')->sum('amount');
        $incomingTransfer = (float) $this->incomingTransfers()->sum('amount');
        $outgoingTransfer = (float) $this->outgoingTransfers()->sum('amount');

        return $income - $expense + $incomingTransfer - $outgoingTransfer;
    }

    public function totalBalance(): float
    {
        return $this->balance;
    }
}
