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
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $type = $request->input('type');

        $allowedSorts = [
            'name',
            'type',
            'created_at',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $wallets = $request->user()
            ->wallets()
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->input('search');
                    // menghindari bug OR pada where bertingkat agar tidak mengambil milik siapa aja
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'ilike', "%{$search}%")
                            ->orWhere('type', 'ilike', "%{$search}%");
                    });
                }
            )
            ->when(
                $request->filled('type'),
                function ($query) use ($type) {
                    $query->where('type', $type);
                }
            )
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Wallets/Index', [
            'wallets' => $wallets,
            'filters' => [
                'search' => $request->input('search'),
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'type' => $type,
            ],
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

        try {
            $request->user()
                ->wallets()
                ->create($validatedData);
            return back()->with('success', 'Wallet Berhasil Ditambahkan');
        } catch (\Exception $e) {
            // ⬅️ Di sini flash error bekerja!
            return back()->with('error', 'Gagal menyimpan wallet. Silakan coba lagi.');
        }
    }

    public function update(
        Request $request,
        Wallet $wallet
    ) {
        if ($wallet->user_id !== $request->user()->id) {
            abort(403);
        }

        $validatedData = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('wallets', 'name')
                    ->ignore($wallet->id)
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
            'name.unique' => 'Dompet dengan nama tersebut sudah pernah dibuat.',
        ]);

        try {
            $wallet->update($validatedData);
            return back()->with('success', 'Wallet Berhasil Diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui wallet. Silakan coba lagi.');
        }
    }

    public function destroy(
        Request $request,
        Wallet $wallet
    ) {
        if ($wallet->user_id !== $request->user()->id) {
            abort(403);
        }

        if (
            $wallet->transactions()->exists() ||
            $wallet->outgoingTransfers()->exists() ||
            $wallet->incomingTransfers()->exists()
        ) {
            return back()->with('error', 'Wallet tidak bisa dihapus karena masih memiliki riwayat transaksi.');
        }

        try {
            $wallet->delete();
            return back()->with('success', 'Wallet Berhasil Dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus wallet. Silakan coba lagi.');
        }
    }
}
