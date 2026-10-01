import { Head, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/Components/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import DataTable from "@/Components/UI/DataTable/DataTable";
import DataTableFilterTabs from "@/Components/UI/DataTable/DataTableFilterTabs";
import DataTablePagination from "@/Components/UI/DataTable/DataTablePagination";
import CategoryFormModal from "@/Components/Category/CategoryFormModal";
import { categoryColumns } from "@/Components/Category/CategoryColumns";
import { useSweetAlert } from "@/Hooks/useSweetAlert";
import type { Category } from "@/Types/category";

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
};

type PageProps = {
    categories: PaginatedData<Category>;
    filters: {
        search?: string;
        sort?: string;
        direction?: "asc" | "desc";
        type?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export default function Index() {
    const { success, error, confirm } = useSweetAlert();
    const { categories, filters, flash } = usePage<PageProps>().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    // Menampilkan notifikasi popup SweetAlert jika ada flash message dari backend
    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            error(flash.error);
        }
    }, [flash.success, flash.error, success, error]);
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
    };
    const handleSearch = (value: string) => {
        router.get(
            "/categories",
            {
                search: value || undefined,
                sort: filters.sort || undefined,
                direction: filters.direction || undefined,
                type: filters.type || undefined,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };
    const handleSort = (sort?: string, direction?: "asc" | "desc") => {
        router.get(
            "/categories",
            {
                search: filters.search || undefined,
                sort: sort || undefined,
                direction: direction || undefined,
                type: filters.type || undefined,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };
    const handleTypeFilter = (type: string) => {
        router.get(
            "/categories",
            {
                search: filters.search || undefined,
                sort: filters.sort || undefined,
                direction: filters.direction || undefined,
                type: type || undefined,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };
    const handleDelete = async (category: Category) => {
        const isConfirmed = await confirm({
            title: `Hapus "${category.name}"?`,
            text: "Data kategori ini akan dihapus secara permanen.",
        });
        if (isConfirmed) {
            router.delete(`/categories/${category.id}`, {
                preserveScroll: true,
            });
        }
    };
    const columns = useMemo(
        () =>
            categoryColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [],
    );
    const categoryTypeOptions = [
        { label: "Semua", value: "" },
        { label: "Pengeluaran", value: "expense" },
        { label: "Pemasukan", value: "income" },
    ];
    return (
        <AppLayout>
            <Head title="Kategori" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-[Fraunces] text-4xl font-semibold text-[#2B2724]">
                                Kategori
                            </h1>
                            <span className="rounded-full border border-[#C2632A]/20 bg-[#C2632A]/10 px-3 py-0.5 text-xs font-semibold text-[#C2632A]">
                                {categories.total} Kategori
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-[#6B6560]">
                            Kelola pos pengeluaran dan sumber pemasukan keuangan
                            kamu.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-1.5 shadow-sm shadow-[#C2632A]/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Kategori</span>
                    </Button>
                </div>
                {/* Table Card */}
                <Card>
                    <DataTable
                        data={categories.data}
                        columns={columns}
                        search={filters.search ?? ""}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Cari kategori..."
                        sort={filters.sort}
                        direction={filters.direction}
                        onSortChange={handleSort}
                        filter={
                            <DataTableFilterTabs
                                options={categoryTypeOptions}
                                selectedValue={filters.type ?? ""}
                                onChange={handleTypeFilter}
                            />
                        }
                    />
                    <DataTablePagination
                        currentPage={categories.current_page}
                        lastPage={categories.last_page}
                        total={categories.total}
                        from={categories.from}
                        to={categories.to}
                        search={filters.search ?? ""}
                        sort={filters.sort}
                        direction={filters.direction}
                        type={filters.type}
                    />
                </Card>
            </div>
            {/* Modal Tambah & Edit */}
            <CategoryFormModal
                isOpen={isCreateModalOpen || editingCategory !== null}
                category={editingCategory}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingCategory(null);
                }}
            />
        </AppLayout>
    );
}
