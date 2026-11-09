import { Head, router, usePage } from "@inertiajs/react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    ReceiptText,
    Scale,
    Wallet as WalletIcon,
} from "lucide-react";
import AppLayout from "@/Components/Layouts/AppLayout";
import Card from "@/Components/UI/Card";
import CashflowChart from "@/Components/Report/CashflowChart";
import CategoryBreakdownCard from "@/Components/Report/CategoryBreakdownCard";
import type {
    CategoryBreakdown,
    DailyTrend,
    ReportFilters,
    ReportSummary,
} from "@/Types/report";
import type { Wallet } from "@/Types/wallet";
import { formatRupiah } from "@/Utils/currency";

type PageProps = {
    summary: ReportSummary;
    category_breakdown: CategoryBreakdown[];
    daily_trends: DailyTrend[];
    wallets: Wallet[];
    filters: ReportFilters;
};

export default function ReportsIndex() {
    const { summary, category_breakdown, daily_trends, wallets, filters } =
        usePage<PageProps>().props;

    const handleFilterChange = (key: keyof ReportFilters, value: string) => {
        router.get(
            "/reports",
            {
                ...filters,
                [key]: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const isSurplus = summary.net >= 0;

    return (
        <AppLayout>
            <Head title="Laporan & Analitik - MoneyTrack" />

            <div className="space-y-8 pb-10">
                {/* 1. Header & Bar Filter */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-[Fraunces] text-3xl font-semibold text-[#2B2724]">
                            Laporan Keuangan
                        </h1>
                        <p className="mt-1 text-sm text-[#6B6560]">
                            Analisis mendalam pemasukan, pengeluaran, dan arus kas harian.
                        </p>
                    </div>

                    {/* Area Kontrol Filter */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filter Bulan */}
                        <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/90 px-3 py-2 shadow-xs">
                            <Calendar className="h-4 w-4 text-[#C2632A]" />
                            <input
                                type="month"
                                value={filters.month}
                                onChange={(e) =>
                                    handleFilterChange("month", e.target.value)
                                }
                                className="bg-transparent text-xs font-semibold text-[#2B2724] focus:outline-hidden"
                            />
                        </div>

                        {/* Filter Dompet */}
                        <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/90 px-3 py-2 shadow-xs">
                            <WalletIcon className="h-4 w-4 text-[#C2632A]" />
                            <select
                                value={filters.wallet_id || ""}
                                onChange={(e) =>
                                    handleFilterChange("wallet_id", e.target.value)
                                }
                                className="bg-transparent text-xs font-semibold text-[#2B2724] focus:outline-hidden"
                            >
                                <option value="">Semua Dompet</option>
                                {wallets.map((wallet) => (
                                    <option key={wallet.id} value={wallet.id}>
                                        {wallet.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Kartu Metrik Ringkasan (4 Kolom) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* A. Pemasukan */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Pemasukan
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B7B5D]/10 text-[#4B7B5D]">
                                <ArrowDownLeft className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-[Inter] text-2xl font-bold tabular-nums text-[#4B7B5D]">
                                +{formatRupiah(summary.income)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                Total dana masuk
                            </span>
                        </div>
                    </Card>

                    {/* B. Pengeluaran */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Pengeluaran
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B54A3F]/10 text-[#B54A3F]">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-[Inter] text-2xl font-bold tabular-nums text-[#B54A3F]">
                                -{formatRupiah(summary.expense)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                Total dana dibelanjakan
                            </span>
                        </div>
                    </Card>

                    {/* C. Arus Kas Bersih */}
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
                                    isSurplus ? "text-[#4B7B5D]" : "text-[#B54A3F]"
                                }`}
                            >
                                {isSurplus ? "+" : ""}
                                {formatRupiah(summary.net)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                {isSurplus ? "Surplus periode ini" : "Defisit periode ini"}
                            </span>
                        </div>
                    </Card>

                    {/* D. Rata-rata Harian */}
                    <Card className="flex flex-col justify-between p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6560]">
                                Rata-rata Harian
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C2632A]/10 text-[#C2632A]">
                                <ReceiptText className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-[Inter] text-2xl font-bold tabular-nums text-[#2B2724]">
                                {formatRupiah(summary.avg_daily_exp)}
                            </div>
                            <span className="text-xs text-[#6B6560]">
                                Pengeluaran / hari
                            </span>
                        </div>
                    </Card>
                </div>

                {/* 3. Bagian Visual: Grafik Arus Kas & Distribusi Kategori */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <CashflowChart data={daily_trends} />
                    </div>

                    <div className="lg:col-span-1">
                        <CategoryBreakdownCard
                            items={category_breakdown}
                            totalExpense={summary.expense}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
