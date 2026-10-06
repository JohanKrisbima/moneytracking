import { useForm } from "@inertiajs/react";
import { useEffect, useMemo, type FormEvent } from "react";

import Button from "@/Components/UI/Button";
import Input from "@/Components/UI/Input";
import Modal from "@/Components/UI/Modal";
import Select from "@/Components/UI/Select";

import type { Category } from "@/Types/category";
import type { Transaction, TransactionForm } from "@/Types/transaction";
import type { Wallet } from "@/Types/wallet";

type TransactionFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    transaction?: Transaction | null;
    wallets: Wallet[];
    categories: Category[];
};

const typeOptions = [
    { label: "Pengeluaran (Expense)", value: "expense" },
    { label: "Pemasukan (Income)", value: "income" },
];

export default function TransactionFormModal({
    isOpen,
    onClose,
    transaction,
    wallets,
    categories,
}: TransactionFormModalProps) {
    const isEditMode = Boolean(transaction);

    // Ambil tanggal hari ini dalam format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<TransactionForm>({
            wallet_id: "",
            category_id: "",
            type: "expense",
            amount: "",
            transaction_date: today,
            description: "",
        });

    // 🎯 Filter Kategori Dinamis: Hanya munculkan kategori yang sesuai dengan tipe transaksi saat ini!
    const categoryOptions = useMemo(() => {
        return categories
            .filter((cat) => cat.type === data.type)
            .map((cat) => ({
                label: cat.name,
                value: String(cat.id),
            }));
    }, [categories, data.type]);

    // Opsi Dompet
    const walletOptions = useMemo(() => {
        return wallets.map((w) => ({
            label: `${w.name} (${w.type.toUpperCase()})`,
            value: String(w.id),
        }));
    }, [wallets]);

    // Mengisi form jika Edit, atau reset form jika Tambah Baru
    useEffect(() => {
        if (transaction) {
            setData({
                wallet_id: String(transaction.wallet_id),
                category_id: String(transaction.category_id),
                type: transaction.type,
                amount: String(transaction.amount),
                transaction_date: transaction.transaction_date
                    ? transaction.transaction_date.substring(0, 10)
                    : today,
                description: transaction.description || "",
            });
        } else {
            setData({
                wallet_id: wallets.length > 0 ? String(wallets[0].id) : "",
                category_id: "",
                type: "expense",
                amount: "",
                transaction_date: today,
                description: "",
            });
        }
        clearErrors();
    }, [transaction, isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    // Saat user mengganti tipe transaksi, kosongkan kategori yang terpilih sebelumnya
    const handleTypeChange = (newType: "income" | "expense") => {
        setData((prev) => ({
            ...prev,
            type: newType,
            category_id: "", // Reset pilihan kategori karena tipenya berganti
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditMode && transaction) {
            put(`/transactions/${transaction.id}`, {
                onSuccess: () => {
                    handleClose();
                },
            });
        } else {
            post("/transactions", {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? "Edit Transaksi" : "Tambah Transaksi Baru"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Pilihan Tipe Transaksi */}
                <Select
                    label="Tipe Transaksi"
                    name="type"
                    value={data.type}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    options={typeOptions}
                    error={errors.type}
                />

                {/* 2. Input Nominal Uang */}
                <Input
                    label="Nominal (Rp)"
                    name="amount"
                    type="number"
                    min="1"
                    step="any"
                    value={data.amount}
                    onChange={(e) => setData("amount", e.target.value)}
                    placeholder="Contoh: 25000"
                    error={errors.amount}
                    autoFocus
                />

                {/* 3. Pilihan Dompet (Wallet) */}
                <Select
                    label="Sumber Dompet"
                    name="wallet_id"
                    value={String(data.wallet_id)}
                    onChange={(e) => setData("wallet_id", e.target.value)}
                    options={walletOptions}
                    placeholder="Pilih dompet..."
                    error={errors.wallet_id}
                />

                {/* 4. Pilihan Kategori (Dinamis sesuai tipe) */}
                <Select
                    label="Kategori"
                    name="category_id"
                    value={String(data.category_id)}
                    onChange={(e) => setData("category_id", e.target.value)}
                    options={categoryOptions}
                    placeholder={
                        categoryOptions.length > 0
                            ? "Pilih kategori..."
                            : `Belum ada kategori ${data.type === "expense" ? "pengeluaran" : "pemasukan"}`
                    }
                    error={errors.category_id}
                />

                {/* 5. Input Tanggal Transaksi */}
                <Input
                    label="Tanggal Transaksi"
                    name="transaction_date"
                    type="date"
                    value={data.transaction_date}
                    onChange={(e) =>
                        setData("transaction_date", e.target.value)
                    }
                    error={errors.transaction_date}
                />

                {/* 6. Deskripsi / Catatan Tambahan (Opsional) */}
                <Input
                    label="Catatan (Opsional)"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Contoh: Kopi susu gula aren, bensin motor"
                    error={errors.description}
                />

                {/* Tombol Aksi */}
                <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing
                            ? "Menyimpan..."
                            : isEditMode
                              ? "Perbarui Transaksi"
                              : "Simpan Transaksi"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
