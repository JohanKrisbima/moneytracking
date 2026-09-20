<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $wallets = $request->user()
            ->wallets()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $wallets
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:100',
                    Rule::unique('wallets', 'name')->where(fn($query) => $query->where('user_id', $request->user()->id)),
                ],
                'type' => [
                    'required',
                    'in:bank,ewallet,cash,saving'
                ],
            ]
        );

        $wallet = $request->user()->wallets()->create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Wallet created successfully',
            'data' => $wallet
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(request $request, Wallet $wallet)
    {
        if ($wallet->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $wallet
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Wallet $wallet)
    {
        if ($wallet->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'in:bank,ewallet,cash,saving'],
        ]);

        $wallet->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Wallet berhasil diubah.',
            'data' => $wallet,
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Wallet $wallet)
    {
        if ($wallet->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet tidak ditemukan.',
            ], 404);
        }

        $wallet->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wallet berhasil dihapus.',
        ]);
    }
}
