import { Head, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/Components/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import DataTable from "@/Components/UI/DataTable/DataTable";
import DataTablePagination from "@/Components/UI/DataTable/DataTablePagination";
import TransferFormModal from "@/Components/Transfer/TransferFormModal";
import { transferColumns } from "@/Components/Transfer/TransferColumns";

import { useSweetAlert } from "@/Hooks/useSweetAlert";
import type { Transfer } from "@/Types/transfer";
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
    transfers: PaginatedData<Transfer>;
    wallets: Wallet[];
    filters: {
        search?: string;
        sort?: string;
        direction?: "asc" | "desc";
        wallet_id?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export default function Index() {
    const { success, error, confirm } = useSweetAlert();
    const { transfers, wallets, filters, flash } = usePage<PageProps>().props;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(
        null,
    );

    // Menampilkan popup SweetAlert jika ada pesan flash sukses/error dari backend
    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            error(flash.error);
        }
    }, [flash.success, flash.error, success, error]);

    const handleEdit = (transfer: Transfer) => {
        setEditingTransfer(transfer);
    };

    const handleSearch = (value: string) => {
        router.get(
            "/transfers",
            {
                search: value || undefined,
                sort: filters.sort || undefined,
                direction: filters.direction || undefined,
                wallet_id: filters.wallet_id || undefined,
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
            "/transfers",
            {
                search: filters.search || undefined,
                sort: sort || undefined,
                direction: direction || undefined,
                wallet_id: filters.wallet_id || undefined,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleDelete = async (transfer: Transfer) => {
        const fromName = transfer.from_wallet?.name || "Dompet Asal";
        const toName = transfer.to_wallet?.name || "Dompet Tujuan";

        const isConfirmed = await confirm({
            title: "Hapus Riwayat Transfer?",
            text: `Data transfer sebesar ${formatRupiah(transfer.amount)} dari ${fromName} ke ${toName} akan dihapus. Saldo kedua dompet akan dikembalikan seperti semula.`,
        });

        if (isConfirmed) {
            router.delete(`/transfers/${transfer.id}`, {
                preserveScroll: true,
            });
        }
    };

    const columns = useMemo(
        () =>
            transferColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [],
    );

    return (
        <AppLayout>
            <Head title="Transfer Antar-Dompet" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-[Fraunces] text-4xl font-semibold text-[#2B2724]">
                                Transfer
                            </h1>
                            <span className="rounded-full border border-[#C2632A]/20 bg-[#C2632A]/10 px-3 py-0.5 text-xs font-semibold text-[#C2632A]">
                                {transfers.total} Riwayat
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-[#6B6560]">
                            Pindahkan dana antar-dompet kamu dan pantau riwayat
                            mutasi perpindahan saldonya.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-1.5 shadow-sm shadow-[#C2632A]/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Catat Transfer</span>
                    </Button>
                </div>

                {/* Table Card */}
                <Card>
                    <DataTable
                        data={transfers.data}
                        columns={columns}
                        search={filters.search ?? ""}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Cari catatan atau nama dompet..."
                        sort={filters.sort}
                        direction={filters.direction}
                        onSortChange={handleSort}
                    />
                    <DataTablePagination
                        currentPage={transfers.current_page}
                        lastPage={transfers.last_page}
                        total={transfers.total}
                        from={transfers.from}
                        to={transfers.to}
                        search={filters.search ?? ""}
                        sort={filters.sort}
                        direction={filters.direction}
                    />
                </Card>
            </div>

            {/* Modal Tambah & Edit Transfer */}
            <TransferFormModal
                isOpen={isCreateModalOpen || editingTransfer !== null}
                transfer={editingTransfer}
                wallets={wallets}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingTransfer(null);
                }}
            />
        </AppLayout>
    );
}
