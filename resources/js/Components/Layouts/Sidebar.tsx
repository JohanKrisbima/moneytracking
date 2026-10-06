import { Link, router, usePage } from "@inertiajs/react";
import {
    BarChart3,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Settings,
    Tags,
    Wallet,
    ArrowLeftRight,
} from "lucide-react";

type MenuItem = {
    label: string;
    href: string;
    icon: React.ElementType;
};

type MenuSection = {
    title: string;
    items: MenuItem[];
};

type SidebarProps = {
    mobile?: boolean;
};

const menuSections: MenuSection[] = [
    {
        title: "MAIN",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "KEUANGAN",
        items: [
            {
                label: "Uang Bulanan",
                href: "/monthly-incomes",
                icon: CircleDollarSign,
            },
            {
                label: "Wallet",
                href: "/wallets",
                icon: Wallet,
            },
            {
                label: "Transaksi",
                href: "/transactions",
                icon: CreditCard,
            },
            {
                label: "Transfer",
                href: "/transfers",
                icon: ArrowLeftRight,
            },
            {
                label: "Kategori",
                href: "/categories",
                icon: Tags,
            },
        ],
    },
    {
        title: "ANALISIS",
        items: [
            {
                label: "Ringkasan",
                href: "/summary",
                icon: BarChart3,
            },
        ],
    },
];

export default function Sidebar({ mobile = false }: SidebarProps) {
    const { url } = usePage();

    return (
        <aside
            className={[
                "fixed inset-y-4 left-4 z-50 flex w-[280px] flex-col rounded-[24px]",
                "border border-white/35 bg-[var(--glass-surface)]",
                "shadow-[var(--shadow-card)] backdrop-blur-[16px] backdrop-saturate-[140%]",
                "dark:border-white/8",
                mobile ? "lg:hidden" : "hidden lg:flex",
            ].join(" ")}
        >
            {/* Brand */}
            <div className="flex h-[108px] items-center border-b border-black/5 px-6 dark:border-white/8">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[var(--primary)] text-[var(--on-primary)] shadow-sm">
                        <Wallet size={22} strokeWidth={2} />
                    </div>

                    <div>
                        <p className="font-heading text-lg font-semibold leading-tight">
                            MoneyTrack
                        </p>

                        <p className="text-xs text-[var(--muted)]">
                            Personal Finance
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="space-y-7">
                    {menuSections.map((section) => (
                        <div key={section.title}>
                            <p className="mb-3 px-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)]">
                                {section.title}
                            </p>

                            <nav className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    const active =
                                        url === item.href ||
                                        (item.href !== "/dashboard" &&
                                            url.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition",
                                                active
                                                    ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-sm"
                                                    : "text-[var(--secondary)] hover:bg-black/5 dark:hover:bg-white/5",
                                            ].join(" ")}
                                        >
                                            <Icon size={19} strokeWidth={1.9} />

                                            <span className="flex-1">
                                                {item.label}
                                            </span>

                                            {active &&
                                                item.label !== "Dashboard" && (
                                                    <ChevronDown
                                                        size={15}
                                                        className="rotate-[-90deg]"
                                                    />
                                                )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-black/5 p-4 dark:border-white/8">
                <button
                    type="button"
                    onClick={() => router.post("/logout")}
                    className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-[var(--secondary)] transition hover:bg-[var(--expense-soft)] hover:text-[var(--expense)]"
                >
                    <LogOut size={19} />

                    <span>Keluar</span>
                </button>
            </div>
        </aside>
    );
}
