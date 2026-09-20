<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MonthlyIncome;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MonthlyIncomeController extends Controller
{
    public function index(Request $request)
    {
        $monthlyIncomes = $request->user()
            ->monthlyIncomes()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $monthlyIncomes,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate(
            [
                'month' => [
                    'required',
                    'integer',
                    'between:1,12',
                ],
                'year' => [
                    'required',
                    'integer',
                    'min:2000',
                    'max:2100',
                ],
                'amount' => [
                    'required',
                    'numeric',
                    'gt:0',
                ],
                'description' => [
                    'nullable',
                    'string',
                ],
            ],
            [
                'month.required' => 'Bulan wajib diisi.',
                'year.required' => 'Tahun wajib diisi.',
                'amount.required' => 'Jumlah uang wajib diisi.',
                'amount.gt' => 'Jumlah uang harus lebih dari 0.',
            ]
        );

        $exists = MonthlyIncome::where('user_id', $request->user()->id)
            ->where('month', $validatedData['month'])
            ->where('year', $validatedData['year'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Uang bulanan untuk bulan tersebut sudah pernah dibuat.',
            ], 422);
        }

        $monthlyIncome = $request->user()
            ->monthlyIncomes()
            ->create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Monthly income created successfully',
            'data' => $monthlyIncome,
        ], 201);
    }

    public function show(Request $request, MonthlyIncome $monthlyIncome)
    {
        if ($monthlyIncome->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Monthly income not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $monthlyIncome,
        ]);
    }

    public function update(Request $request, MonthlyIncome $monthlyIncome)
    {
        if ($monthlyIncome->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Monthly income not found.',
            ], 404);
        }

        $validatedData = $request->validate([
            'month' => [
                'required',
                'integer',
                'between:1,12',
            ],
            'year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],
            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],
            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $exists = MonthlyIncome::where('user_id', $request->user()->id)
            ->where('month', $validatedData['month'])
            ->where('year', $validatedData['year'])
            ->where('id', '!=', $monthlyIncome->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Uang bulanan untuk bulan tersebut sudah pernah dibuat.',
            ], 422);
        }

        $monthlyIncome->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Monthly income updated successfully',
            'data' => $monthlyIncome->fresh(),
        ]);
    }

    public function destroy(Request $request, MonthlyIncome $monthlyIncome)
    {
        if ($monthlyIncome->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Monthly income not found.',
            ], 404);
        }

        $monthlyIncome->delete();

        return response()->json([
            'success' => true,
            'message' => 'Monthly income deleted successfully',
        ]);
    }
}
