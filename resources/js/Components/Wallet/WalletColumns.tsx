import type { ColumnDef } from "@tanstack/react-table";

import Button from "@/Components/UI/Button";
import type { Wallet } from "@/Types/wallet";

type WalletColumnsProps = {
    onEdit: (wallet: Wallet) => void;
    onDelete: (wallet: Wallet) => void;
};

export function walletColumns({
    onEdit,
    onDelete,
}: WalletColumnsProps): ColumnDef<Wallet>[] {
    return [
        {
            accessorKey: "name",
            header: "Nama Wallet",

            cell: ({ row }) => (
                <span className="font-medium text-[#2B2724]">
                    {row.original.name}
                </span>
            ),
        },

        {
            accessorKey: "type",
            header: "Tipe",

            cell: ({ row }) => (
                <span className="capitalize text-[#6B6560]">
                    {row.original.type}
                </span>
            ),
        },

        {
            id: "actions",
            header: "Aksi",

            cell: ({ row }) => {
                const wallet = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => onEdit(wallet)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() => onDelete(wallet)}
                        >
                            Hapus
                        </Button>
                    </div>
                );
            },
        },
    ];
}
