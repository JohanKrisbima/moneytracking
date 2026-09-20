<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MonthlyIncome;
use App\Models\Transaction;
use App\Models\Transfer;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | User
        |--------------------------------------------------------------------------
        */

        $user = User::create([
            'name' => 'Johan Krisbima',
            'email' => 'johan@gmail.com',
            'password' => Hash::make('password'),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Wallets
        |--------------------------------------------------------------------------
        */

        $bca = Wallet::create([
            'user_id' => $user->id,
            'name' => 'BCA',
            'type' => 'bank',
        ]);

        $dana = Wallet::create([
            'user_id' => $user->id,
            'name' => 'DANA',
            'type' => 'ewallet',
        ]);

        $cash = Wallet::create([
            'user_id' => $user->id,
            'name' => 'Cash',
            'type' => 'cash',
        ]);

        $tabungan = Wallet::create([
            'user_id' => $user->id,
            'name' => 'Tabungan',
            'type' => 'saving',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $gaji = Category::create([
            'user_id' => $user->id,
            'name' => 'Gaji',
            'type' => 'income',
        ]);

        $makanan = Category::create([
            'user_id' => $user->id,
            'name' => 'Makanan',
            'type' => 'expense',
        ]);

        $transportasi = Category::create([
            'user_id' => $user->id,
            'name' => 'Transportasi',
            'type' => 'expense',
        ]);

        $hiburan = Category::create([
            'user_id' => $user->id,
            'name' => 'Hiburan',
            'type' => 'expense',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Monthly Income
        |--------------------------------------------------------------------------
        */

        MonthlyIncome::create([
            'user_id' => $user->id,
            'month' => 9,
            'year' => 2026,
            'amount' => 7000000,
            'description' => 'Uang bulanan September 2026',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Transactions
        |--------------------------------------------------------------------------
        */

        // Uang masuk ke BCA
        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $bca->id,
            'category_id' => $gaji->id,
            'type' => 'income',
            'amount' => 7000000,
            'transaction_date' => '2026-09-01',
            'description' => 'Uang bulanan September',
        ]);

        // Makan
        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $bca->id,
            'category_id' => $makanan->id,
            'type' => 'expense',
            'amount' => 50000,
            'transaction_date' => '2026-09-10',
            'description' => 'Makan siang',
        ]);

        // Transportasi
        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $bca->id,
            'category_id' => $transportasi->id,
            'type' => 'expense',
            'amount' => 30000,
            'transaction_date' => '2026-09-11',
            'description' => 'Bensin',
        ]);

        // Hiburan
        Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $dana->id,
            'category_id' => $hiburan->id,
            'type' => 'expense',
            'amount' => 100000,
            'transaction_date' => '2026-09-12',
            'description' => 'Streaming',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Transfers
        |--------------------------------------------------------------------------
        */

        // BCA -> DANA
        Transfer::create([
            'user_id' => $user->id,
            'from_wallet_id' => $bca->id,
            'to_wallet_id' => $dana->id,
            'amount' => 500000,
            'transfer_date' => '2026-09-05',
            'description' => 'Top up DANA',
        ]);

        // BCA -> Tabungan
        Transfer::create([
            'user_id' => $user->id,
            'from_wallet_id' => $bca->id,
            'to_wallet_id' => $tabungan->id,
            'amount' => 2000000,
            'transfer_date' => '2026-09-06',
            'description' => 'Menabung',
        ]);
    }
}
