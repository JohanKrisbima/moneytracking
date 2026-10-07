import { useForm } from "@inertiajs/react";
import { useEffect, useMemo, type FormEvent } from "react";

import Button from "@/Components/UI/Button";
import Input from "@/Components/UI/Input";
import Modal from "@/Components/UI/Modal";
import Select from "@/Components/UI/Select";

import type { Transfer, TransferForm } from "@/Types/transfer";
import type { Wallet } from "@/Types/wallet";
import { formatRupiah } from "@/Utils/currency";

type TransferFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    transfer?: Transfer | null;
    wallets: Wallet[];
};

export default function TransferFormModal({
    isOpen,
    onClose,
    transfer,
    wallets,
}: TransferFormModalProps) {
    const isEditMode = Boolean(transfer);
    const today = new Date().toISOString().split("T")[0];

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<TransferForm>({
            from_wallet_id: "",
            to_wallet_id: "",
            amount: "",
            transfer_date: today,
            description: "",
        });

    // Opsi Dompet Asal (Semua dompet beserta saldonya)
    const fromWalletOptions = useMemo(() => {
        return wallets.map((w) => ({
            label: `${w.name} (${w.type.toUpperCase()})${w.balance !== undefined ? ` • ${formatRupiah(w.balance)}` : ""}`,
            value: String(w.id),
        }));
    }, [wallets]);

    // 🎯 Opsi Dompet Tujuan: Otomatis mengecualikan dompet yang sedang dipilih sebagai asal!
    const toWalletOptions = useMemo(() => {
        return wallets
            .filter((w) => String(w.id) !== String(data.from_wallet_id))
            .map((w) => ({
                label: `${w.name} (${w.type.toUpperCase()})${w.balance !== undefined ? ` • ${formatRupiah(w.balance)}` : ""}`,
                value: String(w.id),
            }));
    }, [wallets, data.from_wallet_id]);

    // Dompet Asal yang sedang aktif dipilih
    const selectedFromWallet = useMemo(() => {
        return wallets.find((w) => String(w.id) === String(data.from_wallet_id));
    }, [wallets, data.from_wallet_id]);

    useEffect(() => {
        if (transfer) {
            setData({
                from_wallet_id: String(transfer.from_wallet_id),
                to_wallet_id: String(transfer.to_wallet_id),
                amount: String(transfer.amount),
                transfer_date: transfer.transfer_date
                    ? transfer.transfer_date.substring(0, 10)
                    : today,
                description: transfer.description || "",
            });
        } else {
            setData({
                from_wallet_id: wallets.length > 0 ? String(wallets[0].id) : "",
                to_wallet_id: wallets.length > 1 ? String(wallets[1].id) : "",
                amount: "",
                transfer_date: today,
                description: "",
            });
        }
        clearErrors();
    }, [transfer, isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditMode && transfer) {
            put(`/transfers/${transfer.id}`, {
                onSuccess: () => {
                    handleClose();
                },
            });
        } else {
            post("/transfers", {
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
            title={isEditMode ? "Edit Transfer" : "Catat Transfer Baru"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Dompet Asal (Pengirim) */}
                <div className="space-y-1">
                    <Select
                        label="Dompet Asal (Sumber Dana)"
                        name="from_wallet_id"
                        value={String(data.from_wallet_id)}
                        onChange={(e) => {
                            setData("from_wallet_id", e.target.value);
                            // Jika dompet tujuan kebetulan sama dengan asal yang baru dipilih, reset tujuan
                            if (String(data.to_wallet_id) === e.target.value) {
                                setData("to_wallet_id", "");
                            }
                        }}
                        options={fromWalletOptions}
                        placeholder="Pilih dompet asal..."
                        error={errors.from_wallet_id}
                    />
                    {selectedFromWallet && selectedFromWallet.balance !== undefined && (
                        <p className="text-xs text-[#6B6560]">
                            Saldo tersedia:{" "}
                            <span className="font-semibold text-[#2B2724]">
                                {formatRupiah(selectedFromWallet.balance)}
                            </span>
                        </p>
                    )}
                </div>

                {/* 2. Dompet Tujuan (Penerima) */}
                <Select
                    label="Dompet Tujuan (Penerima Dana)"
                    name="to_wallet_id"
                    value={String(data.to_wallet_id)}
                    onChange={(e) => setData("to_wallet_id", e.target.value)}
                    options={toWalletOptions}
                    placeholder="Pilih dompet tujuan..."
                    error={errors.to_wallet_id}
                />

                {/* 3. Nominal Transfer */}
                <Input
                    label="Nominal Transfer (Rp)"
                    name="amount"
                    type="number"
                    min="1"
                    step="any"
                    value={data.amount}
                    onChange={(e) => setData("amount", e.target.value)}
                    placeholder="Contoh: 100000"
                    error={errors.amount}
                    autoFocus
                />

                {/* 4. Tanggal Transfer */}
                <Input
                    label="Tanggal Transfer"
                    name="transfer_date"
                    type="date"
                    value={data.transfer_date}
                    onChange={(e) => setData("transfer_date", e.target.value)}
                    error={errors.transfer_date}
                />

                {/* 5. Catatan / Deskripsi Tambahan */}
                <Input
                    label="Catatan (Opsional)"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Contoh: Tarik tunai ATM, top-up GoPay"
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
                              ? "Perbarui Transfer"
                              : "Simpan Transfer"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
