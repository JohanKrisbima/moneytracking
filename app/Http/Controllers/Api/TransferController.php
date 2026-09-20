<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        $transfers = $request->user()
            ->transfers()
            ->with(['fromWallet', 'toWallet'])
            ->latest('transfer_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transfers,
        ]);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $validatedData = $request->validate([
            'from_wallet_id' => [
                'required',
                'integer',
                Rule::exists('wallets', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'to_wallet_id' => [
                'required',
                'integer',
                'different:from_wallet_id',
                Rule::exists('wallets', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transfer_date' => [
                'required',
                'date',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $transfer = $request->user()
            ->transfers()
            ->create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Transfer created successfully',
            'data' => $transfer->load(['fromWallet', 'toWallet']),
        ], 201);
    }

    public function show(Request $request, Transfer $transfer)
    {
        if ($transfer->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Transfer not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transfer->load(['fromWallet', 'toWallet']),
        ]);
    }

    public function update(Request $request, Transfer $transfer)
    {
        if ($transfer->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Transfer not found.',
            ], 404);
        }

        $userId = $request->user()->id;

        $validatedData = $request->validate([
            'from_wallet_id' => [
                'required',
                'integer',
                Rule::exists('wallets', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'to_wallet_id' => [
                'required',
                'integer',
                'different:from_wallet_id',
                Rule::exists('wallets', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transfer_date' => [
                'required',
                'date',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $transfer->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Transfer updated successfully',
            'data' => $transfer->fresh()->load(['fromWallet', 'toWallet']),
        ]);
    }

    public function destroy(Request $request, Transfer $transfer)
    {
        if ($transfer->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Transfer not found.',
            ], 404);
        }

        $transfer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transfer deleted successfully',
        ]);
    }
}
