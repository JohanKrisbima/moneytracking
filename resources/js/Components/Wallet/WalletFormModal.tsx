import { useForm } from "@inertiajs/react";
import { useEffect, type FormEvent } from "react";
import Button from "@/Components/UI/Button";
import Input from "@/Components/UI/Input";
import Modal from "@/Components/UI/Modal";
import Select from "@/Components/UI/Select";
import type { Wallet } from "@/Types/wallet";

type WalletFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    wallet?: Wallet | null;
};

const typeOptions = [
    { label: "Bank", value: "bank" },
    { label: "E-Wallet", value: "ewallet" },
    { label: "Cash (Uang Tunai)", value: "cash" },
    { label: "Tabungan", value: "saving" },
];

export default function WalletFormModal({
    isOpen,
    onClose,
    wallet,
}: WalletFormModalProps) {
    const isEditMode = Boolean(wallet);

    // useForm dari Inertia menangani data form, loading state, dan error validasi secara otomatis
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            type: "bank",
        });

    // Mengisi form jika dalam mode Edit, atau mereset jika dalam mode Tambah
    useEffect(() => {
        if (wallet) {
            setData({
                name: wallet.name,
                type: wallet.type,
            });
        } else {
            setData({
                name: "",
                type: "bank",
            });
        }
        clearErrors();
    }, [wallet, isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditMode && wallet) {
            put(`/wallets/${wallet.id}`, {
                onSuccess: () => {
                    handleClose();
                },
            });
        } else {
            post("/wallets", {
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
            title={isEditMode ? "Edit Wallet" : "Tambah Wallet Baru"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input Nama Wallet */}
                <Input
                    label="Nama Wallet"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Contoh: BCA Utama, Gopay, Dompet Saku"
                    error={errors.name}
                    autoFocus
                />
                {/* Dropdown Tipe Wallet */}
                <Select
                    label="Tipe Wallet"
                    name="type"
                    value={data.type}
                    onChange={(e) => setData("type", e.target.value)}
                    options={typeOptions}
                    error={errors.type}
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
                              ? "Perbarui Wallet"
                              : "Simpan Wallet"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
