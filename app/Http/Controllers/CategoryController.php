<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Validation\Rule;
use PhpParser\Node\Stmt\TryCatch;


class CategoryController extends Controller
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

        $categories = $request->user()
            ->categories()
            // Jika ada input search, filter nama kategorinya
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->input('search');
                    $query->where('name', 'ilike', "%{$search}%");
                }
            )
            // Jika user memilih filter tipe (income atau expense)
            ->when(
                $request->filled('type'),
                function ($query) use ($type) {
                    $query->where('type', $type);
                }
            )
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString(); 

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'search'    => $request->input('search'),
                'sort'      => $request->input('sort'),
                'direction' => $request->input('direction'),
                'type'      => $type,
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
                Rule::unique('categories', 'name')
                    ->where(fn($query) => $query->where('user_id', $request->user()->id))
                    ->where('type', $request->input('type'))
            ],
            'type' => [
                'required',
                Rule::in(['income', 'expense']),
            ],
        ], 
        [
            'name.unique' => 'Nama kategori sudah ada!',
        ]);

        try {
            $request->user()
                ->categories()
                ->create($validatedData);

            return back()->with('success', 'Kategori Berhasil Ditambahkan');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menyimpan kategori. Silakan coba lagi.');
        }
    }


    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            abort(403);
        }

        $validatedData = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'name')
                    ->ignore($category->id)
                    ->where(fn($query) => $query->where('user_id', $request->user()->id))
                    ->where('type', $request->input('type')),
            ],
            'type' => [
                'required',
                Rule::in(['income', 'expense']),
            ],
        ], [
            'name.unique' => 'Nama kategori dengan tipe tersebut sudah ada!',
        ]);

        try {
            $category->update($validatedData);

            return back()->with('success', 'Kategori Berhasil Diperbarui');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui kategori. Silakan coba lagi.');
        }
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            abort(403);
        }

        // Cek apakah kategori sudah pernah dipakai di transaksi
        if ($category->transactions()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih digunakan pada data transaksi.');
        }

        try {
            $category->delete();

            return back()->with('success', 'Kategori Berhasil Dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus kategori. Silakan coba lagi.');
        }
    }


}
