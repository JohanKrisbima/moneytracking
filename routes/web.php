<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WalletController;

Route::get('/', function () {
    return Inertia::render('welcome');
});


Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])
        ->name('login');

    Route::post('/login', [LoginController::class, 'store'])
        ->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])
        ->name('logout');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');
});


Route::middleware('auth')->group(function () {
    Route::resource('wallets', WalletController::class)
        ->only([
            'index',
            'store',
            'update',
            'destroy',
        ]);
    
    Route::resource('categories', CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('transactions', TransactionController::class)
        ->only(['index', 'store', 'update', 'destroy']);

     Route::resource('transfers', TransferController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});
