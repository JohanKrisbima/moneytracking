import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    Pencil,
    Trash2,
    Wallet as WalletIcon,
} from "lucide-react";

import type { Transaction } from "@/Types/transaction";
import { formatRupiah } from "@/Utils/currency";
import { formatDate } from "@/Utils/date";

type TransactionColumnsProps = {
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
};

export function transactionColumns({
    onEdit,
    onDelete,
}: TransactionColumnsProps): ColumnDef<Transaction>[] {
    return [
        // 1. Kolom Tanggal
        {
            accessorKey: "transaction_date",
            header: "Tanggal",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs font-medium text-[#6B6560]">
                    <Calendar className="h-3.5 w-3.5 text-[#C2632A]" />
                    <span>{formatDate(row.original.transaction_date)}</span>
                </div>
            ),
        },

        // 2. Kolom Kategori & Deskripsi
        {
            id: "category_and_description",
            header: "Kategori & Catatan",
            cell: ({ row }) => {
                const isExpense = row.original.type === "expense";
                const categoryName =
                    row.original.category?.name || "Tanpa Kategori";
                const description = row.original.description;

                return (
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                                isExpense
                                    ? "border-rose-200/60 bg-rose-500/10 text-rose-600"
                                    : "border-emerald-200/60 bg-emerald-500/10 text-emerald-600"
                            }`}
                        >
                            {isExpense ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownLeft className="h-4 w-4" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#2B2724]">
                                {categoryName}
                            </div>
                            <div className="truncate text-xs text-[#6B6560]">
                                {description || "-"}
                            </div>
                        </div>
                    </div>
                );
            },
        },

        // 3. Kolom Dompet (Wallet)
        {
            accessorKey: "wallet_id",
            header: "Dompet",
            cell: ({ row }) => {
                const walletName = row.original.wallet?.name || "Dompet";

                return (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-[#2B2724]">
                        <WalletIcon className="h-3 w-3 text-[#6B6560]" />
                        <span>{walletName}</span>
                    </div>
                );
            },
        },

        // 4. Kolom Nominal (Amount)
        {
            accessorKey: "amount",
            header: "Nominal",
            cell: ({ row }) => {
                const isExpense = row.original.type === "expense";
                const amountFormatted = formatRupiah(row.original.amount);

                return (
                    <span
                        className={`text-sm font-semibold ${
                            isExpense ? "text-rose-600" : "text-emerald-600"
                        }`}
                    >
                        {isExpense
                            ? `- ${amountFormatted}`
                            : `+ ${amountFormatted}`}
                    </span>
                );
            },
        },

        // 5. Kolom Aksi
        {
            id: "actions",
            header: "Aksi",
            enableSorting: false,
            cell: ({ row }) => {
                const transaction = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(transaction)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[#2B2724] shadow-2xs transition hover:border-[#C2632A]/40 hover:bg-white hover:text-[#C2632A]"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(transaction)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200/70 bg-red-50/60 px-2.5 py-1.5 text-xs font-medium text-red-600 shadow-2xs transition hover:border-red-300 hover:bg-red-100/80 hover:text-red-700"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus</span>
                        </button>
                    </div>
                );
            },
        },
    ];
}
