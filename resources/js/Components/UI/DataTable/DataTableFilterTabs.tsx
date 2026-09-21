
type FilterOption = {
    label: string;
    value: string;
};

type DataTableFilterTabsProps = {
    options: FilterOption[];
    selectedValue: string;
    onChange: (value: string) => void;
};

export default function DataTableFilterTabs({
    options,
    selectedValue,
    onChange,
}: DataTableFilterTabsProps) {
    return (
        <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/35 bg-white/55 p-1 backdrop-blur-[16px]">
            {options.map((option) => {
                const isActive = (selectedValue || "") === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            isActive
                                ? "bg-[#C2632A] font-semibold text-white shadow-xs"
                                : "text-[#6B6560] hover:bg-black/5 hover:text-[#2B2724]"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
