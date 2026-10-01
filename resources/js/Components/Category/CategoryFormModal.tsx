import { useForm } from "@inertiajs/react";
import { useEffect, type FormEvent } from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Modal from "../UI/Modal";
import Select from "../UI/Select";
import type { Category, CategoryForm } from "@/Types/category";

type CategoryFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
};

const typeOptions = [
    { label: "Pengeluaran (Expense)", value: "expense" },
    { label: "Pemasukan (Income)", value: "income" },
];

export default function CategoryFormModal({
    isOpen,
    onClose,
    category,
}: CategoryFormModalProps) {
    const isEditMode = Boolean(category);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<CategoryForm>({
            name: "",
            type: "expense",
        });

    // MENGISI FORM JIKA DALAM MODE EDIT, ATAU RESET FORM JIKA TAMBAH BARU
    useEffect(() => {
        if (category) {
            setData({
                name: category.name,
                type: category.type,
            });
        } else {
            setData({
                name: "",
                type: "expense",
            });
        }
        clearErrors();
    }, [category, isOpen]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditMode && category) {
            put(`/categories/${category.id}`, {
                onSuccess: () => {
                    handleClose();
                },
            });
        } else {
            post("/categories", {
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
            title={isEditMode ? "Edit Kategori" : "Tambah Kategori Baru"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nama Kategori"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Contoh: Makanan & Minuman, Gaji, Transportasi"
                    error={errors.name}
                    autoFocus
                />

                {/* Dropdown Tipe */}
                <Select
                    label="Tipe Kategori"
                    name="type"
                    value={data.type}
                    onChange={(e) => setData("type", e.target.value as any)}
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
                              ? "Perbarui Kategori"
                              : "Simpan Kategori"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
