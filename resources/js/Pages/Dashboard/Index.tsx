import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    Banknote,
    CreditCard,
    Landmark,
    PiggyBank,
    Scale,
    Smartphone,
    TrendingDown,
    TrendingUp,
    Wallet as WalletIcon,
} from "lucide-react";
import { useEffect } from "react";
import AppLayout from "@/Components/Layouts/AppLayout";
import Card from "@/Components/UI/Card";
import { useSweetAlert } from "@/Hooks/useSweetAlert";
import type { Transaction } from "@/Types/transaction";
import type { Wallet } from "@/Types/wallet";
import { formatRupiah } from "@/Utils/currency";
import { formatDate } from "@/Utils/date";
type DashboardSummary = {
    total_balance: number;
    this_month_income: number;
    this_month_expense: number;
    this_month_net: number;
};
type PageProps = {
    summary: DashboardSummary;
    wallets: Wallet[];
    recent_transactions: Transaction[];
    flash: {
        success?: string;
        error?: string;
    };
};
const walletIcons: Record<string, typeof Landmark> = {
    bank: Landmark,
    ewallet: Smartphone,
    cash: Banknote,
    saving: PiggyBank,
};
export default function Dashboard() {
    const { success, error } = useSweetAlert();
    const { summary, wallets, recent_transactions, flash } =
        usePage<PageProps>().props;
    // Tampilkan notifikasi jika ada flash message
    useEffect(() => {
        if (flash.success) success(flash.success);
        if (flash.error) error(flash.error);
    }, [flash.success, flash.error, success, error]);
    const isSurplus = summary.this_month_net >= 0;
    // Ambil nama bulan dan tahun saat ini (contoh: "Oktober 2026")
    const currentMonthLabel = new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
    }).format(new Date());
    return (
        <AppLayout>
            <Head title="Dashboard - MoneyTrack" />
            <div className="space-y-8">
                {/* 1. Header Section */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-[Fraunces] text-4xl font-semibold text-[#2B2724]">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-[#6B6560]">
                            Ringkasan kesehatan finansial dan arus kas kamu pada
                            periode ini.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#2B2724] shadow-xs">
                        <span className="h-2 w-2 rounded-full bg-[#C2632A]" />
                        <span>Periode: {currentMonthLabel}</span>
                    </div>
                </div>
                {/* 2. Kartu Metrik Utama (4 Kolom) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* A. Total Saldo Seluruh Dompet */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Total Saldo
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C2632A]/10 text-[#C2632A]">
                                <WalletIcon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-[Inter] text-2xl font-bold tabular-nums text-[#2B2724]">
                                {formatRupiah(summary.total_balance)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                Akumulasi seluruh dompet
                            </span>
                        </div>
                    </Card>
                    {/* B. Pemasukan Bulan Ini */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Pemasukan Bulan Ini
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B7B5D]/10 text-[#4B7B5D]">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-[Inter] text-2xl font-bold tabular-nums text-[#4B7B5D]">
                                +{formatRupiah(summary.this_month_income)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                Arus kas masuk bulan berjalan
                            </span>
                        </div>
                    </Card>
                    {/* C. Pengeluaran Bulan Ini */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Pengeluaran Bulan Ini
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B54A3F]/10 text-[#B54A3F]">
                                <TrendingDown className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-[Inter] text-2xl font-bold tabular-nums text-[#B54A3F]">
                                -{formatRupiah(summary.this_month_expense)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                Arus kas keluar bulan berjalan
                            </span>
                        </div>
                    </Card>
                    {/* D. Arus Kas Bersih (Net Flow) */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Arus Kas Bersih
                            </span>
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                    isSurplus
                                        ? "bg-[#4B7B5D]/10 text-[#4B7B5D]"
                                        : "bg-[#B54A3F]/10 text-[#B54A3F]"
                                }`}
                            >
                                <Scale className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div
                                className={`font-[Inter] text-2xl font-bold tabular-nums ${
                                    isSurplus
                                        ? "text-[#4B7B5D]"
                                        : "text-[#B54A3F]"
                                }`}
                            >
                                {isSurplus ? "+" : ""}
                                {formatRupiah(summary.this_month_net)}
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 text-xs font-medium ${
                                    isSurplus
                                        ? "text-[#4B7B5D]"
                                        : "text-[#B54A3F]"
                                }`}
                            >
                                {isSurplus
                                    ? "● Surplus (Hemat)"
                                    : "● Defisit (Pengeluaran > Pemasukan)"}
                            </span>
                        </div>
                    </Card>
                </div>
                {/* 3. Grid 2 Kolom: Dompet & Transaksi Terbaru */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Kolom Kiri: Dompet Kamu (5 Kolom) */}
                    <div className="space-y-4 lg:col-span-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="font-[Fraunces] text-xl font-semibold text-[#2B2724]">
                                    Dompet Saya
                                </h2>
                                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-[#6B6560]">
                                    {wallets.length}
                                </span>
                            </div>
                            <Link
                                href="/wallets"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2632A] transition hover:underline"
                            >
                                <span>Kelola</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <Card className="divide-y divide-black/5 p-2">
                            {wallets.length === 0 ? (
                                <div className="py-8 text-center text-xs text-[#6B6560]">
                                    Belum ada dompet dibuat.
                                </div>
                            ) : (
                                wallets.map((wallet) => {
                                    const IconComponent =
                                        walletIcons[wallet.type] || Landmark;
                                    return (
                                        <div
                                            key={wallet.id}
                                            className="flex items-center justify-between p-3 transition hover:bg-black/[0.02]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B2724]/5 text-[#2B2724]">
                                                    <IconComponent className="h-5 w-5 text-[#6B6560]" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-[#2B2724]">
                                                        {wallet.name}
                                                    </div>
                                                    <div className="text-xs uppercase text-[#6B6560]">
                                                        {wallet.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-[Inter] text-sm font-bold tabular-nums text-[#2B2724]">
                                                    {formatRupiah(
                                                        wallet.balance ?? 0,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </Card>
                    </div>
                    {/* Kolom Kanan: Transaksi Terkini (7 Kolom) */}
                    <div className="space-y-4 lg:col-span-7">
                        <div className="flex items-center justify-between">
                            <h2 className="font-[Fraunces] text-xl font-semibold text-[#2B2724]">
                                Transaksi Terkini
                            </h2>
                            <Link
                                href="/transactions"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2632A] transition hover:underline"
                            >
                                <span>Lihat Semua</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <Card className="divide-y divide-black/5 p-2">
                            {recent_transactions.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[#6B6560]">
                                    Belum ada transaksi yang dicatat.
                                </div>
                            ) : (
                                recent_transactions.map((tx) => {
                                    const isIncome = tx.type === "income";
                                    return (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between p-3.5 transition hover:bg-black/[0.02]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                                        isIncome
                                                            ? "bg-[#4B7B5D]/10 text-[#4B7B5D]"
                                                            : "bg-[#B54A3F]/10 text-[#B54A3F]"
                                                    }`}
                                                >
                                                    {isIncome ? (
                                                        <ArrowDownLeft className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-[#2B2724]">
                                                        {tx.category?.name ||
                                                            tx.description ||
                                                            "Transaksi"}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-[#6B6560]">
                                                        <span>
                                                            {tx.wallet?.name}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {formatDate(
                                                                tx.transaction_date,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`font-[Inter] text-sm font-bold tabular-nums ${
                                                        isIncome
                                                            ? "text-[#4B7B5D]"
                                                            : "text-[#B54A3F]"
                                                    }`}
                                                >
                                                    {isIncome ? "+" : "-"}
                                                    {formatRupiah(tx.amount)}
                                                </div>
                                                {tx.description && (
                                                    <div className="max-w-[140px] truncate text-xs text-[#6B6560]">
                                                        {tx.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
