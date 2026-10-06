import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowRight,
    Calendar,
    Pencil,
    Trash2,
    Wallet as WalletIcon,
} from "lucide-react";

import type { Transfer } from "@/Types/transfer";
import { formatRupiah } from "@/Utils/currency";
import { formatDate } from "@/Utils/date";

type TransferColumnsProps = {
    onEdit: (transfer: Transfer) => void;
    onDelete: (transfer: Transfer) => void;
};

export function transferColumns({
    onEdit,
    onDelete,
}: TransferColumnsProps): ColumnDef<Transfer>[] {
    return [
        // 1. Kolom Tanggal
        {
            accessorKey: "transfer_date",
            header: "Tanggal",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs font-medium text-[#6B6560]">
                    <Calendar className="h-3.5 w-3.5 text-[#C2632A]" />
                    <span>{formatDate(row.original.transfer_date)}</span>
                </div>
            ),
        },

        // 2. Kolom Alur Transfer (Asal -> Tujuan) & Catatan
        {
            id: "transfer_flow",
            header: "Alur Transfer",
            cell: ({ row }) => {
                const fromWallet =
                    row.original.from_wallet?.name || "Dompet Asal";
                const toWallet =
                    row.original.to_wallet?.name || "Dompet Tujuan";
                const description = row.original.description;

                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                            {/* Dompet Asal */}
                            <span className="inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white/70 px-2 py-1 font-medium text-[#2B2724]">
                                <WalletIcon className="h-3 w-3 text-[#6B6560]" />
                                {fromWallet}
                            </span>

                            {/* Panah Transfer */}
                            <ArrowRight className="h-3.5 w-3.5 text-[#C2632A]" />

                            {/* Dompet Tujuan */}
                            <span className="inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white/70 px-2 py-1 font-medium text-[#2B2724]">
                                <WalletIcon className="h-3 w-3 text-[#6B6560]" />
                                {toWallet}
                            </span>
                        </div>

                        {/* Catatan / Keterangan */}
                        {description && (
                            <p className="truncate text-xs text-[#6B6560]">
                                {description}
                            </p>
                        )}
                    </div>
                );
            },
        },

        // 3. Kolom Nominal
        {
            accessorKey: "amount",
            header: "Nominal",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-[#2B2724]">
                    {formatRupiah(row.original.amount)}
                </span>
            ),
        },

        // 4. Kolom Aksi
        {
            id: "actions",
            header: "Aksi",
            enableSorting: false,
            cell: ({ row }) => {
                const transfer = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(transfer)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[#2B2724] shadow-2xs transition hover:border-[#C2632A]/40 hover:bg-white hover:text-[#C2632A]"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(transfer)}
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
