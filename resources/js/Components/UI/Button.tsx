import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#C2632A] text-white hover:bg-[#A34F1E]",

    secondary:
        "border border-black/10 bg-white/60 text-[#2B2724] hover:bg-white/80",

    danger: "bg-[#B54A3F] text-white hover:bg-[#963D34]",
};

export default function Button({
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            className={`
                inline-flex
                items-center
                justify-center
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${variants[variant]}
                ${className}
            `}
        />
    );
}
