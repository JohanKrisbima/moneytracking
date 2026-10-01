import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownLeft, ArrowUpRight, Pencil, Tag, Trash2 } from "lucide-react";

import type { Category } from "@/Types/category";

type CategoryColumnProps = {
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
};

const categoryTypeConfig = {
    expense: {
        label: "Pengeluaran",
        sublabel: "Pos Pengeluaran",
        icon: ArrowUpRight,
        iconBg: "bg-rose-500/10 border-rose-200/60",
        iconColor: "text-rose-600",
        badgeBg: "bg-rose-500/10 border-rose-200/60",
        badgeText: "text-rose-700",
        badgeDot: "bg-rose-500",
    },
    income: {
        label: "Pemasukan",
        sublabel: "Sumber Pemasukan",
        icon: ArrowDownLeft,
        iconBg: "bg-emerald-500/10 border-emerald-200/60",
        iconColor: "text-emerald-600",
        badgeBg: "bg-emerald-500/10 border-emerald-200/60",
        badgeText: "text-emerald-700",
        badgeDot: "bg-emerald-500",
    },
};

export function categoryColumns({
    onEdit,
    onDelete,
}: CategoryColumnProps): ColumnDef<Category>[] {
    return [
        {
            accessorKey: "name",
            header: "Nama Kategori",
            cell: ({ row }) => {
                const type = row.original.type;
                const config = categoryTypeConfig[type] || {
                    label: type,
                    sublabel: "Kategori",
                    icon: Tag,
                    iconBg: "bg-stone-500/10 border-stone-200",
                    iconColor: "text-stone-600",
                    badgeBg: "bg-stone-500/10 border-stone-200",
                    badgeText: "text-stone-700",
                    badgeDot: "bg-stone-500",
                };

                return (
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${config.iconBg}`}
                        >
                            <config.icon
                                className={`h-4 w-4 ${config.iconColor}`}
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="font-semibold text-[#2B2724]">
                                {row.original.name}
                            </div>
                            <div className="text-xs text-[#6B6560] first-letter:uppercase">
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
                const config = categoryTypeConfig[type] || {
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
            id: "actions",
            header: "Aksi",
            enableSorting: false,
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(category)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[#2B2724] shadow-2xs transition hover:border-[#C2632A]/40 hover:bg-white hover:text-[#C2632A]"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(category)}
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
