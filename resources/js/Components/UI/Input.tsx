import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export default function Input({
    label,
    error,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || props.name;

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#6B6560]"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                {...props}
                className={`w-full rounded-xl border border-black/10 bg-white/60 px-4 py-2.5 text-sm text-[#2B2724] outline-none transition placeholder:text-[#6B6560]/60 focus:border-[#C2632A] focus:bg-white focus:ring-2 focus:ring-[#C2632A]/20 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : ""
                } ${className}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
