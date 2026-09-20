import { Head, router, usePage } from "@inertiajs/react";
import { useMemo } from "react";

import AppLayout from "@/Components/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import DataTable from "@/Components/UI/DataTable/DataTable";

import { walletColumns } from "@/Components/Wallet/WalletColumns";

import type { Wallet } from "@/Types/wallet";

type PageProps = {
    wallets: Wallet[];
};

export default function Index() {
    const { wallets } = usePage<PageProps>().props;

    const handleEdit = (wallet: Wallet) => {
        console.log("Edit wallet:", wallet);
    };

    const handleDelete = (wallet: Wallet) => {
        const confirmed = window.confirm(`Hapus wallet "${wallet.name}"?`);

        if (!confirmed) {
            return;
        }

        router.delete(`/wallets/${wallet.id}`, {
            preserveScroll: true,
        });
    };

    const columns = useMemo(
        () =>
            walletColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [],
    );

    return (
        <AppLayout>
            <Head title="Wallets" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-[Fraunces] text-4xl font-semibold text-[#2B2724]">
                            Wallets
                        </h1>

                        <p className="mt-2 text-sm text-[#6B6560]">
                            Kelola sumber uang yang kamu miliki.
                        </p>
                    </div>

                    <Button>+ Tambah Wallet</Button>
                </div>

                {/* Table */}
                <Card>
                    <DataTable data={wallets} columns={columns} />
                </Card>
            </div>
        </AppLayout>
    );
}
