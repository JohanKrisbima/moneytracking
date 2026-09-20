<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()
            ->transactions()
            ->with(['wallet', 'category'])
            ->latest('transaction_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $validatedData = $request->validate([
            'wallet_id' => [
                'required',
                'integer',
                Rule::exists('wallets', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'type' => [
                'required',
                'in:income,expense',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transaction_date' => [
                'required',
                'date',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $category = $request->user()
            ->categories()
            ->find($validatedData['category_id']);

        if ($category->type !== $validatedData['type']) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe transaksi tidak sesuai dengan tipe kategori.',
            ], 422);
        }

        $transaction = $request->user()
            ->transactions()
            ->create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Transaction created successfully',
            'data' => $transaction->load(['wallet', 'category']),
        ], 201);
    }

    public function show(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction->load(['wallet', 'category']),
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found.',
            ], 404);
        }

        $userId = $request->user()->id;

        $validatedData = $request->validate([
            'wallet_id' => [
                'required',
                'integer',
                Rule::exists('wallets', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')
                    ->where(fn($query) => $query->where('user_id', $userId)),
            ],

            'type' => [
                'required',
                'in:income,expense',
            ],

            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'transaction_date' => [
                'required',
                'date',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $category = $request->user()
            ->categories()
            ->find($validatedData['category_id']);

        if ($category->type !== $validatedData['type']) {
            return response()->json([
                'success' => false,
                'message' => 'Tipe transaksi tidak sesuai dengan tipe kategori.',
            ], 422);
        }

        $transaction->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Transaction updated successfully',
            'data' => $transaction->fresh()->load(['wallet', 'category']),
        ]);
    }

    public function destroy(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found.',
            ], 404);
        }

        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully',
        ]);
    }
}
