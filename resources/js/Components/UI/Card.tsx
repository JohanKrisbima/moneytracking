import type { HTMLAttributes } from "react";

export default function Card({
    className = "",
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={`
                rounded-2xl
                border
                border-white/35
                bg-white/55
                p-6
                shadow-[0_8px_32px_rgba(0,0,0,0.06)]
                backdrop-blur-[16px]
                ${className}
            `}
        />
    );
}
