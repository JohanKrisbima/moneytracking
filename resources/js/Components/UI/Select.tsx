import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
    label: string;
    value: string;
};

type SelectProps = {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (e: { target: { name: string; value: string } }) => void;
    options: Option[];
    placeholder?: string;
    searchPlaceholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
};

export default function Select({
    label,
    name = "",
    value = "",
    onChange,
    options,
    placeholder = "Pilih opsi...",
    searchPlaceholder = "Cari opsi...",
    error,
    disabled = false,
    className = "",
    id,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectId = id || name;

    // Menemukan label dari opsi yang saat ini dipilih
    const selectedOption = options.find((opt) => opt.value === value);

    // Menyaring opsi berdasarkan apa yang sedang diketik user
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Otomatis fokus ke input pencarian saat dropdown terbuka
    useEffect(() => {
        if (isOpen) {
            setSearchQuery("");
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Menutup dropdown jika user mengklik di luar komponen atau tekan Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        if (disabled) return;

        // Mengirimkan event buatan yang cocok dengan format e.target.value di useForm
        onChange?.({
            target: {
                name,
                value: optionValue,
            },
        });

        setIsOpen(false);
    };

    return (
        <div className="relative space-y-1.5" ref={containerRef}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#6B6560]"
                >
                    {label}
                </label>
            )}

            {/* Tombol Utama (Tampilan Select Box) */}
            <button
                id={selectId}
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center justify-between rounded-xl border border-black/10 bg-white/60 px-4 py-2.5 text-sm text-[#2B2724] outline-none transition focus:border-[#C2632A] focus:bg-white focus:ring-2 focus:ring-[#C2632A]/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : ""
                } ${className}`}
            >
                <span
                    className={`truncate ${
                        selectedOption
                            ? "font-medium text-[#2B2724]"
                            : "text-[#6B6560]/60"
                    }`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <ChevronDown
                    className={`h-4 w-4 text-[#6B6560] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#C2632A]" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu Pencarian (Select2 Popover) */}
            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-white/40 bg-white/95 p-2 shadow-xl backdrop-blur-xl transition-all">
                    {/* Kotak Pencarian di dalam Dropdown */}
                    <div className="relative mb-2">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6560]" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full rounded-xl border border-black/10 bg-black/[0.02] py-2 pl-9 pr-3 text-xs text-[#2B2724] outline-none transition focus:border-[#C2632A] focus:bg-white focus:ring-2 focus:ring-[#C2632A]/10"
                        />
                    </div>

                    {/* Daftar Opsi */}
                    <div className="max-h-52 overflow-y-auto space-y-0.5">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === value;

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                                            isSelected
                                                ? "bg-[#C2632A]/10 font-semibold text-[#C2632A]"
                                                : "text-[#2B2724] hover:bg-black/5"
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-[#C2632A]" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-[#6B6560]">
                                Tidak ada hasil yang cocok.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
