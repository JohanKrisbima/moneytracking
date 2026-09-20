<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Wallets/Index', [
            'wallets' => $request->user()
                ->wallets()
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',

                Rule::unique('wallets', 'name')
                    ->where(
                        fn($query) =>
                        $query->where(
                            'user_id',
                            $request->user()->id
                        )
                    ),
            ],

            'type' => [
                'required',
                Rule::in([
                    'bank',
                    'ewallet',
                    'cash',
                    'saving',
                ]),
            ],
        ], [
            'name.unique' =>
            'Dompet dengan nama tersebut sudah pernah dibuat.',
        ]);

        $request->user()
            ->wallets()
            ->create($validatedData);

        return back();
    }

    public function update(
        Request $request,
        Wallet $wallet
    ) {
        //
    }

    public function destroy(
        Request $request,
        Wallet $wallet
    ) {
        //
    }
}
