import { Head, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/Components/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import DataTable from "@/Components/UI/DataTable/DataTable";
import DataTableFilterTabs from "@/Components/UI/DataTable/DataTableFilterTabs";
import DataTablePagination from "@/Components/UI/DataTable/DataTablePagination";
import TransactionFormModal from "@/Components/Transaction/TransactionFormModal";
import { transactionColumns } from "@/Components/Transaction/TransactionColumns";

import { useSweetAlert } from "@/Hooks/useSweetAlert";
import type { Category } from "@/Types/category";
import type { Transaction } from "@/Types/transaction";
import type { Wallet } from "@/Types/wallet";
import { formatRupiah } from "@/Utils/currency";

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
    transactions: PaginatedData<Transaction>;
    wallets: Wallet[];
    categories: Category[];
    filters: {
        search?: string;
        sort?: string;
        direction?: "asc" | "desc";
        type?: string;
        wallet_id?: string;
        category_id?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export default function Index() {
    const { success, error, confirm } = useSweetAlert();
    const { transactions, wallets, categories, filters, flash } =
        usePage<PageProps>().props;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);

    // Menampilkan popup SweetAlert jika ada flash message sukses/error dari backend
    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            error(flash.error);
        }
    }, [flash.success, flash.error, success, error]);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
    };

    const handleSearch = (value: string) => {
        router.get(
            "/transactions",
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
            "/transactions",
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
            "/transactions",
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

    const handleDelete = async (transaction: Transaction) => {
        const isConfirmed = await confirm({
            title: "Hapus Transaksi?",
            text: `Data transaksi sebesar ${formatRupiah(transaction.amount)} ini akan dihapus secara permanen.`,
        });

        if (isConfirmed) {
            router.delete(`/transactions/${transaction.id}`, {
                preserveScroll: true,
            });
        }
    };

    const columns = useMemo(
        () =>
            transactionColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [],
    );

    const transactionTypeOptions = [
        { label: "Semua", value: "" },
        { label: "Pengeluaran", value: "expense" },
        { label: "Pemasukan", value: "income" },
    ];

    return (
        <AppLayout>
            <Head title="Transaksi" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-[Fraunces] text-4xl font-semibold text-[#2B2724]">
                                Transaksi
                            </h1>
                            <span className="rounded-full border border-[#C2632A]/20 bg-[#C2632A]/10 px-3 py-0.5 text-xs font-semibold text-[#C2632A]">
                                {transactions.total} Transaksi
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-[#6B6560]">
                            Pantau dan catat seluruh riwayat arus kas masuk dan
                            keluar kamu.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-1.5 shadow-sm shadow-[#C2632A]/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Transaksi</span>
                    </Button>
                </div>

                {/* Table Card */}
                <Card>
                    <DataTable
                        data={transactions.data}
                        columns={columns}
                        search={filters.search ?? ""}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Cari catatan, kategori, dompet..."
                        sort={filters.sort}
                        direction={filters.direction}
                        onSortChange={handleSort}
                        filter={
                            <DataTableFilterTabs
                                options={transactionTypeOptions}
                                selectedValue={filters.type ?? ""}
                                onChange={handleTypeFilter}
                            />
                        }
                    />
                    <DataTablePagination
                        currentPage={transactions.current_page}
                        lastPage={transactions.last_page}
                        total={transactions.total}
                        from={transactions.from}
                        to={transactions.to}
                        search={filters.search ?? ""}
                        sort={filters.sort}
                        direction={filters.direction}
                        type={filters.type}
                    />
                </Card>
            </div>

            {/* Modal Tambah & Edit Transaksi */}
            <TransactionFormModal
                isOpen={isCreateModalOpen || editingTransaction !== null}
                transaction={editingTransaction}
                wallets={wallets}
                categories={categories}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingTransaction(null);
                }}
            />
        </AppLayout>
    );
}
