import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl";
};

const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "md",
}: ModalProps) {
    // Menutup modal jika user menekan tombol 'Escape' di keyboard
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Latar Belakang Gelap / Blur */}
            <div
                className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />
            {/* Kotak Modal Glassmorphism */}
            <div
                className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-2xl border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-all`}
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                    <h2 className="font-[Fraunces] text-xl font-semibold text-[#2B2724]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-[#6B6560] transition hover:bg-black/5 hover:text-[#2B2724]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {/* Konten Form */}
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}
