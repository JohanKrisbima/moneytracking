import { Head, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import WalletFormModal from "@/Components/Wallet/WalletFormModal";

import AppLayout from "@/Components/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import DataTable from "@/Components/UI/DataTable/DataTable";
import DataTablePagination from "@/Components/UI/DataTable/DataTablePagination";

import { walletColumns } from "@/Components/Wallet/WalletColumns";

import DataTableFilterTabs from "@/Components/UI/DataTable/DataTableFilterTabs";

import { useSweetAlert } from "@/Hooks/useSweetAlert";

import type { Wallet } from "@/Types/wallet";

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
    wallets: PaginatedData<Wallet>;
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

    const { wallets, filters, flash } = usePage<PageProps>().props;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            error(flash.error);
        }
    }, [flash.success, flash.error, success, error]);

    const handleEdit = (wallet: Wallet) => {
        setEditingWallet(wallet);
        console.log("Edit wallet:", wallet);
    };

    const handleSearch = (value: string) => {
        router.get(
            "/wallets",
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
            "/wallets",
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
            "/wallets",
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

    const handleDelete = async (wallet: Wallet) => {
        const isConfirmed = await confirm({
            title: `Hapus "${wallet.name}"?`,
            text: "Data wallet ini akan dihapus secara permanen.",
        });

        if (isConfirmed) {
            router.delete(`/wallets/${wallet.id}`, {
                preserveScroll: true,
            });
        }
    };

    const columns = useMemo(
        () =>
            walletColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [],
    );

    const walletTypeOptions = [
        { label: "Semua", value: "" },
        { label: "Bank", value: "bank" },
        { label: "E-Wallet", value: "ewallet" },
        { label: "Cash", value: "cash" },
        { label: "Tabungan", value: "saving" },
    ];

    return (
        <AppLayout>
            <Head title="Wallets" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-[Fraunces] text-4xl font-semibold text-[#2B2724]">
                                Wallets
                            </h1>
                            <span className="rounded-full border border-[#C2632A]/20 bg-[#C2632A]/10 px-3 py-0.5 text-xs font-semibold text-[#C2632A]">
                                {wallets.total} Dompet
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-[#6B6560]">
                            Kelola sumber uang dan alokasi dana yang kamu miliki.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-1.5 shadow-sm shadow-[#C2632A]/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Wallet</span>
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <DataTable
                        data={wallets.data}
                        columns={columns}
                        search={filters.search ?? ""}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Cari wallet..."
                        sort={filters.sort}
                        direction={filters.direction}
                        onSortChange={handleSort}
                        filter={
                            <DataTableFilterTabs
                                options={walletTypeOptions}
                                selectedValue={filters.type ?? ""}
                                onChange={handleTypeFilter}
                            />
                        }
                    />
                    <DataTablePagination
                        currentPage={wallets.current_page}
                        lastPage={wallets.last_page}
                        total={wallets.total}
                        from={wallets.from}
                        to={wallets.to}
                        search={filters.search ?? ""}
                        sort={filters.sort}
                        direction={filters.direction}
                        type={filters.type}
                    />
                </Card>
            </div>

            <WalletFormModal
                isOpen={isCreateModalOpen || editingWallet !== null}
                wallet={editingWallet}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingWallet(null);
                }}
            />
        </AppLayout>
    );
}
