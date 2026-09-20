import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, Clock3, Menu } from "lucide-react";

type NavbarProps = {
    onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const date = currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const time = currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return (
        <header className="sticky top-4 z-30 mb-6 rounded-[24px] border border-white/35 bg-[var(--glass-surface)] px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-[16px] backdrop-saturate-[140%] dark:border-white/8 sm:px-5">
            <div className="flex min-h-12 items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--secondary)] transition hover:bg-black/5 lg:hidden dark:hover:bg-white/5"
                    >
                        <Menu size={20} />
                    </button>

                    {/* System */}
                    <div className="hidden items-center gap-2 rounded-full border border-white/35 bg-white/40 px-4 py-2 text-sm sm:flex dark:border-white/8 dark:bg-white/5">
                        <span className="h-2 w-2 rounded-full bg-[var(--income)]" />

                        <span className="font-medium">MoneyTrack</span>
                    </div>

                    {/* Date */}
                    <div className="hidden items-center gap-2 rounded-full border border-white/35 bg-white/40 px-4 py-2 text-sm text-[var(--secondary)] md:flex dark:border-white/8 dark:bg-white/5">
                        <CalendarDays
                            size={17}
                            className="text-[var(--muted)]"
                        />

                        <span>{date}</span>
                    </div>

                    {/* Time */}
                    <div className="hidden items-center gap-2 rounded-full border border-white/35 bg-white/40 px-4 py-2 text-sm md:flex dark:border-white/8 dark:bg-white/5">
                        <Clock3 size={17} className="text-[var(--muted)]" />

                        <span className="font-medium tabular-nums">{time}</span>

                        <span className="text-xs font-semibold text-[var(--muted)]">
                            WIB
                        </span>
                    </div>
                </div>

                {/* User */}
                <button
                    type="button"
                    className="flex items-center gap-3 rounded-full px-2 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/5"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--on-primary)]">
                        JK
                    </div>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold leading-tight">
                            Johan Krisbima
                        </p>

                        <p className="text-[11px] font-medium tracking-wide text-[var(--muted)] uppercase">
                            Personal
                        </p>
                    </div>

                    <ChevronDown size={17} className="text-[var(--muted)]" />
                </button>
            </div>
        </header>
    );
}
