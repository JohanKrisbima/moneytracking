<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Tentukan bulan yang dipilih (default: bulan & tahun sekarang, format: YYYY-MM)
        $selectedMonth = $request->input('month', Carbon::now()->format('Y-m'));
        $selectedWalletId = $request->input('wallet_id');

        // Tentukan tanggal awal dan akhir dari bulan yang dipilih
        $startDate = Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth();
        $endDate = Carbon::createFromFormat('Y-m', $selectedMonth)->endOfMonth();

        // 2. Query dasar transaksi user pada rentang bulan tersebut
        $query = $user->transactions()
            ->whereBetween('transaction_date', [$startDate->toDateString(), $endDate->toDateString()]);

        // Filter opsional berdasarkan dompet jika user memilih dompet tertentu
        if ($selectedWalletId) {
            $query->where('wallet_id', $selectedWalletId);
        }

        // Ambil semua transaksi pada rentang tersebut beserta relasinya
        $transactions = $query->with(['category', 'wallet'])->get();

        // 3. Hitung Metrik Ringkasan (Summary)
        $totalIncome = (float) $transactions->where('type', 'income')->sum('amount');
        $totalExpense = (float) $transactions->where('type', 'expense')->sum('amount');
        $netCashFlow = $totalIncome - $totalExpense;

        // 4. Breakdown Pengeluaran per Kategori
        $categoryBreakdown = $transactions->where('type', 'expense')
            ->groupBy('category_id')
            ->map(function ($items) use ($totalExpense) {
                $category = $items->first()->category;
                $categoryTotal = (float) $items->sum('amount');
                $percentage = $totalExpense > 0 ? round(($categoryTotal / $totalExpense) * 100, 1) : 0;

                return [
                    'category_id' => $category?->id,
                    'name'        => $category?->name ?? 'Tanpa Kategori',
                    'color'       => $category?->color ?? '#6B6560',
                    'icon'        => $category?->icon ?? 'Tag',
                    'total'       => $categoryTotal,
                    'percentage'  => $percentage,
                    'count'       => $items->count(),
                ];
            })
            ->sortByDesc('total')
            ->values();

        // 5. Tren Harian (Daily Cashflow) untuk Grafik
        // Kelompokkan transaksi berdasarkan tanggal string (Y-m-d) agar pencocokan 100% akurat
        $transactionsByDate = $transactions->groupBy(function ($t) {
            return Carbon::parse($t->transaction_date)->toDateString();
        });

        $daysInMonth = $startDate->daysInMonth;
        $dailyTrends = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $currentDayDate = $startDate->copy()->day($day)->toDateString();
            $dayTransactions = $transactionsByDate->get($currentDayDate, collect());

            $dailyTrends[] = [
                'day'     => $day,
                'date'    => $currentDayDate,
                'income'  => (float) $dayTransactions->where('type', 'income')->sum('amount'),
                'expense' => (float) $dayTransactions->where('type', 'expense')->sum('amount'),
            ];
        }

        // 6. Ambil daftar dompet untuk dropdown filter
        $wallets = $user->wallets()->orderBy('name')->get();

        return Inertia::render('Reports/Index', [
            'summary' => [
                'income'        => $totalIncome,
                'expense'       => $totalExpense,
                'net'           => $netCashFlow,
                'avg_daily_exp' => $daysInMonth > 0 ? round($totalExpense / $daysInMonth) : 0,
            ],
            'category_breakdown' => $categoryBreakdown,
            'daily_trends'       => $dailyTrends,
            'wallets'            => $wallets,
            'filters'            => [
                'month'     => $selectedMonth,
                'wallet_id' => $selectedWalletId ? (string) $selectedWalletId : '',
            ],
        ]);
    }
}