<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = $request->user()
            ->categories()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:100',
                    Rule::unique('categories', 'name')
                        ->where(
                            fn($query) => $query
                                ->where('user_id', $request->user()->id)
                                ->where('type', $request->type)
                        ),
                ],
                'type' => [
                    'required',
                    'in:income,expense',
                ],
            ],
            [
                'name.unique' => 'Kategori dengan nama tersebut sudah pernah dibuat.',
            ]
        );

        $category = $request->user()
            ->categories()
            ->create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    public function show(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        $validatedData = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:100',
                    Rule::unique('categories', 'name')
                        ->where(
                            fn($query) => $query
                                ->where('user_id', $request->user()->id)
                                ->where('type', $request->type)
                        )
                        ->ignore($category->id),
                ],
                'type' => [
                    'required',
                    'in:income,expense',
                ],
            ],
            [
                'name.unique' => 'Kategori dengan nama tersebut sudah pernah dibuat.',
            ]
        );

        $category->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category->fresh(),
        ]);
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }
}
