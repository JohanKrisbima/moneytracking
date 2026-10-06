<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        // 1. Parameter Sort & Filter
        $sort = $request->input('sort', 'transfer_date');
        $direction = $request->input('direction', 'desc');
        $walletId = $request->input('wallet_id');

        $allowedSorts = ['transfer_date', 'amount', 'created_at'];
        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'transfer_date';
        }
        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        // 2. Query Data Transfer dengan Eager Loading (fromWallet & toWallet)
        $transfers = $request->user()
            ->transfers()
            ->with(['fromWallet', 'toWallet'])
            // Pencarian deskripsi atau nama dompet asal/tujuan
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->input('search');
                    $query->where(function ($q) use ($search) {
                        $q->where('description', 'ilike', "%{$search}%")
                          ->orWhereHas('fromWallet', fn($sub) => $sub->where('name', 'ilike', "%{$search}%"))
                          ->orWhereHas('toWallet', fn($sub) => $sub->where('name', 'ilike', "%{$search}%"));
                    });
                }
            )
            // Filter jika user ingin melihat mutasi transfer pada dompet tertentu
            ->when(
                $request->filled('wallet_id'),
                function ($query) use ($walletId) {
                    $query->where(function ($q) use ($walletId) {
                        $q->where('from_wallet_id', $walletId)
                          ->orWhere('to_wallet_id', $walletId);
                    });
                }
            )
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        // 3. Render ke Halaman Inertia
        return Inertia::render('Transfers/Index', [
            'transfers' => $transfers,
            // Master data dompet untuk pilihan dropdown modal transfer
            'wallets'   => $request->user()->wallets()->orderBy('name')->get(['id', 'name', 'type']),
            'filters'   => [
                'search'    => $request->input('search'),
                'sort'      => $request->input('sort'),
                'direction' => $request->input('direction'),
                'wallet_id' => $walletId,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'from_wallet_id' => [
                'required',
                Rule::exists('wallets', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                ),
            ],
            'to_wallet_id' => [
                'required',
                'different:from_wallet_id', // Dompet tujuan tidak boleh sama dengan asal
                Rule::exists('wallets', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                ),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:1',
            ],
            'transfer_date' => [
                'required',
                'date',
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ], [
            'from_wallet_id.exists'  => 'Dompet asal tidak valid.',
            'to_wallet_id.exists'    => 'Dompet tujuan tidak valid.',
            'to_wallet_id.different' => 'Dompet tujuan tidak boleh sama dengan dompet asal.',
            'amount.min'             => 'Nominal transfer minimal Rp 1.',
        ]);

        try {
            $request->user()
                ->transfers()
                ->create($validatedData);

            return back()->with('success', 'Transfer Berhasil Dicatat');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mencatat transfer. Silakan coba lagi.');
        }
    }

    public function update(Request $request, Transfer $transfer)
    {
        if ($transfer->user_id !== $request->user()->id) {
            abort(403);
        }

        $validatedData = $request->validate([
            'from_wallet_id' => [
                'required',
                Rule::exists('wallets', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                ),
            ],
            'to_wallet_id' => [
                'required',
                'different:from_wallet_id',
                Rule::exists('wallets', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                ),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:1',
            ],
            'transfer_date' => [
                'required',
                'date',
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ], [
            'from_wallet_id.exists'  => 'Dompet asal tidak valid.',
            'to_wallet_id.exists'    => 'Dompet tujuan tidak valid.',
            'to_wallet_id.different' => 'Dompet tujuan tidak boleh sama dengan dompet asal.',
            'amount.min'             => 'Nominal transfer minimal Rp 1.',
        ]);

        try {
            $transfer->update($validatedData);

            return back()->with('success', 'Transfer Berhasil Diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui transfer. Silakan coba lagi.');
        }
    }

    public function destroy(Request $request, Transfer $transfer)
    {
        if ($transfer->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $transfer->delete();

            return back()->with('success', 'Transfer Berhasil Dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus transfer. Silakan coba lagi.');
        }
    }
}
