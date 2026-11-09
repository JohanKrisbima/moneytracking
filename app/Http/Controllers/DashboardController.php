<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Ambil seluruh dompet milik user (beserta accessor saldo otomatisnya)
        $wallets = $user->wallets()->orderBy('name')->get();

        // 2. Hitung Total Saldo Bersih (Jumlah saldo seluruh dompet)
        $totalBalance = (float) $wallets->sum('balance');

        // 3. Tentukan rentang waktu bulan berjalan (Awal bulan s/d Hari ini)
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth   = Carbon::now()->endOfMonth()->toDateString();

        // 4. Hitung Pemasukan dan Pengeluaran khusus bulan ini
        $thisMonthIncome = (float) $user->transactions()
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $thisMonthExpense = (float) $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        // 5. Ambil 5 Transaksi Terakhir (dengan relasi wallet & category)
        $recentTransactions = $user->transactions()
            ->with(['wallet', 'category'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 6. Kirim semua data ke halaman React Inertia
        return Inertia::render('Dashboard/Index', [
            'summary' => [
                'total_balance'       => $totalBalance,
                'this_month_income'   => $thisMonthIncome,
                'this_month_expense'  => $thisMonthExpense,
                'this_month_net'      => $thisMonthIncome - $thisMonthExpense,
            ],
            'wallets'             => $wallets,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
