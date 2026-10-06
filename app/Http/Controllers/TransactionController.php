<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        // 1. Parameter Sort & Filter
        $sort = $request->input('sort', 'transaction_date');
        $direction = $request->input('direction', 'desc');
        $type = $request->input('type');
        $walletId = $request->input('wallet_id');
        $categoryId = $request->input('category_id');

        $allowedSorts = ['transaction_date', 'amount', 'created_at'];
        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'transaction_date';
        }
        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        // 2. Query Transaksi dengan Eager Loading
        $transactions = $request->user()
            ->transactions()
            ->with(['wallet', 'category'])
            // Pencarian deskripsi atau nama kategori
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->input('search');
                    $query->where(function ($q) use ($search) {
                        $q->where('description', 'ilike', "%{$search}%")
                          ->orWhereHas('category', function ($sub) use ($search) {
                              $sub->where('name', 'ilike', "%{$search}%");
                          })
                          ->orWhereHas('wallet', function ($sub) use ($search) {
                              $sub->where('name', 'ilike', "%{$search}%");
                          });
                    });
                }
            )
            // Filter tipe (income / expense)
            ->when(
                $request->filled('type'),
                fn($query) => $query->where('type', $type)
            )
            // Filter berdasarkan dompet tertentu (opsional)
            ->when(
                $request->filled('wallet_id'),
                fn($query) => $query->where('wallet_id', $walletId)
            )
            // Filter berdasarkan kategori tertentu (opsional)
            ->when(
                $request->filled('category_id'),
                fn($query) => $query->where('category_id', $categoryId)
            )
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        // 3. Render ke halaman React
        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            // Mengirim data master untuk isi dropdown form modal
            'wallets'      => $request->user()->wallets()->orderBy('name')->get(['id', 'name', 'type']),
            'categories'   => $request->user()->categories()->orderBy('name')->get(['id', 'name', 'type']),
            'filters'      => [
                'search'      => $request->input('search'),
                'sort'        => $request->input('sort'),
                'direction'   => $request->input('direction'),
                'type'        => $type,
                'wallet_id'   => $walletId,
                'category_id' => $categoryId,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'wallet_id' => [
                'required',
                Rule::exists('wallets', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                ),
            ],
            'type' => [
                'required',
                Rule::in(['income', 'expense']),
            ],
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                                ->where('type', $request->input('type'))
                ),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:1',
            ],
            'transaction_date' => [
                'required',
                'date',
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ], [
            'wallet_id.exists'   => 'Dompet yang dipilih tidak valid.',
            'category_id.exists' => 'Kategori tidak sesuai dengan tipe transaksi.',
            'amount.min'         => 'Nominal transaksi minimal Rp 1.',
        ]);

        try {
            $request->user()
                ->transactions()
                ->create($validatedData);

            return back()->with('success', 'Transaksi Berhasil Ditambahkan');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan transaksi. Silakan coba lagi.');
        }
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        $validatedData = $request->validate([
            'wallet_id' => [
                'required',
                Rule::exists('wallets', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                ),
            ],
            'type' => [
                'required',
                Rule::in(['income', 'expense']),
            ],
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')->where(
                    fn($q) => $q->where('user_id', $request->user()->id)
                                ->where('type', $request->input('type'))
                ),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:1',
            ],
            'transaction_date' => [
                'required',
                'date',
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ], [
            'wallet_id.exists'   => 'Dompet yang dipilih tidak valid.',
            'category_id.exists' => 'Kategori tidak sesuai dengan tipe transaksi.',
            'amount.min'         => 'Nominal transaksi minimal Rp 1.',
        ]);

        try {
            $transaction->update($validatedData);

            return back()->with('success', 'Transaksi Berhasil Diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui transaksi. Silakan coba lagi.');
        }
    }

    public function destroy(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $transaction->delete();

            return back()->with('success', 'Transaksi Berhasil Dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus transaksi. Silakan coba lagi.');
        }
    }

}
