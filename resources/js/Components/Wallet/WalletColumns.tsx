import type { ColumnDef } from "@tanstack/react-table";
import {
    Banknote,
    Landmark,
    Pencil,
    PiggyBank,
    Smartphone,
    Trash2,
} from "lucide-react";

import type { Wallet } from "@/Types/wallet";
import { formatRupiah } from "@/Utils/currency";

type WalletColumnsProps = {
    onEdit: (wallet: Wallet) => void;
    onDelete: (wallet: Wallet) => void;
};

const typeConfig: Record<
    string,
    {
        label: string;
        sublabel: string;
        icon: typeof Landmark;
        iconBg: string;
        iconColor: string;
        badgeBg: string;
        badgeText: string;
        badgeDot: string;
    }
> = {
    bank: {
        label: "Bank",
        sublabel: "Rekening Bank",
        icon: Landmark,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600",
        badgeBg: "bg-blue-500/10 border-blue-200/60",
        badgeText: "text-blue-700",
        badgeDot: "bg-blue-500",
    },
    ewallet: {
        label: "E-Wallet",
        sublabel: "Dompet Digital",
        icon: Smartphone,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600",
        badgeBg: "bg-purple-500/10 border-purple-200/60",
        badgeText: "text-purple-700",
        badgeDot: "bg-purple-500",
    },
    cash: {
        label: "Cash",
        sublabel: "Uang Fisik",
        icon: Banknote,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600",
        badgeBg: "bg-emerald-500/10 border-emerald-200/60",
        badgeText: "text-emerald-700",
        badgeDot: "bg-emerald-500",
    },
    saving: {
        label: "Tabungan",
        sublabel: "Simpanan Khusus",
        icon: PiggyBank,
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600",
        badgeBg: "bg-amber-500/10 border-amber-200/60",
        badgeText: "text-amber-700",
        badgeDot: "bg-amber-500",
    },
};

export function walletColumns({
    onEdit,
    onDelete,
}: WalletColumnsProps): ColumnDef<Wallet>[] {
    return [
        {
            accessorKey: "name",
            header: "Nama Wallet",
            cell: ({ row }) => {
                const type = row.original.type;
                const config = typeConfig[type] || {
                    label: type,
                    sublabel: "Dompet",
                    icon: Landmark,
                    iconBg: "bg-stone-500/10",
                    iconColor: "text-stone-600",
                    badgeBg: "bg-stone-500/10 border-stone-200",
                    badgeText: "text-stone-700",
                    badgeDot: "bg-stone-500",
                };
                const Icon = config.icon;

                return (
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/5 ${config.iconBg} ${config.iconColor}`}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-[#2B2724]">
                                {row.original.name}
                            </div>
                            <div className="text-xs text-[#6B6560]">
                                {config.sublabel}
                            </div>
                        </div>
                    </div>
                );
            },
        },

        {
            accessorKey: "type",
            header: "Tipe",
            cell: ({ row }) => {
                const type = row.original.type;
                const config = typeConfig[type] || {
                    label: type,
                    badgeBg: "bg-stone-500/10 border-stone-200",
                    badgeText: "text-stone-700",
                    badgeDot: "bg-stone-500",
                };

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${config.badgeDot}`}
                        />
                        {config.label}
                    </span>
                );
            },
        },

        {
            accessorKey: "balance",
            header: "Saldo Saat Ini",
            cell: ({ row }) => (
                <div className="font-medium text-sm text-[#2B2724]">
                    {formatRupiah(row.original.balance ?? 0)}
                </div>
            ),
        },

        {
            id: "actions",
            header: "Aksi",
            enableSorting: false,
            cell: ({ row }) => {
                const wallet = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(wallet)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[#2B2724] shadow-2xs transition hover:border-[#C2632A]/40 hover:bg-white hover:text-[#C2632A]"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(wallet)}
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
