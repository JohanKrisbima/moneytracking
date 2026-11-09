import Card from "@/Components/UI/Card";
import type { DailyTrend } from "@/Types/report";
import { formatRupiah } from "@/Utils/currency";
import { formatDate } from "@/Utils/date";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    Flame,
    Layers,
    Sparkles,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
    data: DailyTrend[];
};

export default function CashflowChart({ data }: Props) {
    const [viewMode, setViewMode] = useState<"split" | "expense" | "income">(
        "split",
    );
    const [hoveredDay, setHoveredDay] = useState<DailyTrend | null>(null);

    // 1. Perhitungan Statistik Finansial
    const stats = useMemo(() => {
        const totalIncome = data.reduce((acc, d) => acc + d.income, 0);
        const totalExpense = data.reduce((acc, d) => acc + d.expense, 0);
        const net = totalIncome - totalExpense;

        const sortedExpense = [...data].sort((a, b) => b.expense - a.expense);
        const topExpense =
            sortedExpense[0]?.expense > 0 ? sortedExpense[0] : null;

        const sortedIncome = [...data].sort((a, b) => b.income - a.income);
        const topIncome = sortedIncome[0]?.income > 0 ? sortedIncome[0] : null;

        const activeDays = data.filter((d) => d.income > 0 || d.expense > 0);
        const burnRatePercent =
            totalIncome > 0
                ? ((totalExpense / totalIncome) * 100).toFixed(1)
                : "0";

        return {
            totalIncome,
            totalExpense,
            net,
            topExpense,
            topIncome,
            activeDaysCount: activeDays.length,
            burnRatePercent,
        };
    }, [data]);

    // 2. Skala Maksimum Mandiri (Dengan Headroom 35% agar kurva anggun dan tidak menabrak atap)
    const { scaleMaxIncome, scaleMaxExpense } = useMemo(() => {
        const peakInc = Math.max(...data.map((d) => d.income), 0);
        const effInc = peakInc === 0 ? 100000 : peakInc;
        const scaleInc = Math.ceil((effInc * 1.35) / 10000) * 10000;

        const peakExp = Math.max(...data.map((d) => d.expense), 0);
        const effExp = peakExp === 0 ? 100000 : peakExp;
        const scaleExp = Math.ceil((effExp * 1.35) / 10000) * 10000;

        return { scaleMaxIncome: scaleInc, scaleMaxExpense: scaleExp };
    }, [data]);

    // Dimensi SVG
    const svgWidth = 840;
    const paddingLeft = 24;
    const paddingRight = 24;
    const paddingTop = 28;
    const paddingBottom = 32;
    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const stepX = chartWidth / (data.length - 1 || 1);

    // 3. Render Kurva Tunggal dengan Desain Halus
    const renderCurveChart = (
        type: "income" | "expense",
        scaleMax: number,
        height: number,
    ) => {
        const currentChartHeight = height - paddingTop - paddingBottom;

        const getY = (val: number) => {
            return (
                paddingTop +
                currentChartHeight -
                (val / scaleMax) * currentChartHeight
            );
        };

        // Bangun kurva halus Bezier
        let linePath = "";
        if (data.length > 0) {
            const points = data.map((d, i) => ({
                x: paddingLeft + i * stepX,
                y: getY(d[type]),
            }));

            linePath = `M ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i === 0 ? 0 : i - 1];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[i + 2] || p2;

                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;

                linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }
        }

        const baseline = paddingTop + currentChartHeight;
        const lastX = paddingLeft + (data.length - 1) * stepX;
        const areaPath = linePath
            ? `${linePath} L ${lastX} ${baseline} L ${paddingLeft} ${baseline} Z`
            : "";

        const isIncome = type === "income";
        const strokeColor = isIncome ? "#4B7B5D" : "#B54A3F";
        const gradId = isIncome ? "gradIncModern" : "gradExpModern";

        return (
            <div className="relative">
                <svg
                    viewBox={`0 0 ${svgWidth} ${height}`}
                    className="w-full overflow-visible"
                    style={{ height: `${height}px` }}
                >
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor={strokeColor}
                                stopOpacity="0.22"
                            />
                            <stop
                                offset="100%"
                                stopColor={strokeColor}
                                stopOpacity="0.0"
                            />
                        </linearGradient>
                    </defs>

                    {/* Garis Grid Horizontal Lembut */}
                    {[0, 0.5, 1].map((ratio) => {
                        const y = paddingTop + currentChartHeight * (1 - ratio);
                        const val = Math.round(scaleMax * ratio);
                        return (
                            <g key={ratio}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={svgWidth - paddingRight}
                                    y2={y}
                                    stroke="currentColor"
                                    strokeDasharray="4 4"
                                    className="text-black/[0.06]"
                                />
                                {ratio > 0 && (
                                    <text
                                        x={paddingLeft}
                                        y={y - 6}
                                        fontSize="9"
                                        fontWeight="500"
                                        className="fill-[#6B6560] font-[Inter]"
                                    >
                                        {formatRupiah(val)}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Fill Area dan Kurva */}
                    <path d={areaPath} fill={`url(#${gradId})`} />
                    <path
                        d={linePath}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />

                    {/* Titik Transaksi (Dots) + Badge Nominal Otomatis di Puncak */}
                    {data.map((item, idx) => {
                        const val = item[type];
                        if (val <= 0) return null;
                        const cx = paddingLeft + idx * stepX;
                        const cy = getY(val);

                        return (
                            <g key={`dot-${item.day}`}>
                                {/* Lingkaran Titik Transaksi */}
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r="5"
                                    fill="#FFFFFF"
                                    stroke={strokeColor}
                                    strokeWidth="2.5"
                                    className="transition-transform duration-200 hover:scale-125"
                                />

                                {/* Label Nominal Langsung di Atas Titik */}
                                <g transform={`translate(${cx}, ${cy - 12})`}>
                                    <rect
                                        x="-30"
                                        y="-13"
                                        width="60"
                                        height="16"
                                        rx="8"
                                        fill="#FFFFFF"
                                        stroke={strokeColor}
                                        strokeWidth="1"
                                        className="shadow-2xs opacity-90"
                                    />
                                    <text
                                        x="0"
                                        y="-2"
                                        textAnchor="middle"
                                        fontSize="8.5"
                                        fontWeight="700"
                                        fill={strokeColor}
                                        className="font-[Inter] tabular-nums"
                                    >
                                        {formatRupiah(val)}
                                    </text>
                                </g>
                            </g>
                        );
                    })}

                    {/* Area Deteksi Hover & Sumbu X */}
                    {data.map((item, index) => {
                        const lineX = paddingLeft + index * stepX;
                        const hasVal = item[type] > 0;
                        const isHovered = hoveredDay?.day === item.day;

                        return (
                            <g
                                key={`hover-area-${item.day}`}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredDay(item)}
                                onMouseLeave={() => setHoveredDay(null)}
                            >
                                <rect
                                    x={lineX - stepX / 2}
                                    y={paddingTop}
                                    width={stepX}
                                    height={currentChartHeight}
                                    fill="transparent"
                                />

                                {isHovered && (
                                    <line
                                        x1={lineX}
                                        y1={paddingTop}
                                        x2={lineX}
                                        y2={paddingTop + currentChartHeight}
                                        stroke="#C2632A"
                                        strokeWidth="1.5"
                                        strokeDasharray="3 3"
                                    />
                                )}

                                {/* Nomor Tanggal di Sumbu X */}
                                {(item.day === 1 ||
                                    item.day % 5 === 0 ||
                                    item.day === data.length ||
                                    hasVal) && (
                                    <text
                                        x={lineX}
                                        y={height - 10}
                                        textAnchor="middle"
                                        fontSize={hasVal ? "10" : "9"}
                                        fontWeight={hasVal ? "700" : "500"}
                                        className={
                                            hasVal
                                                ? "fill-[#C2632A] font-[Inter]"
                                                : "fill-[#6B6560] font-[Inter]"
                                        }
                                    >
                                        {item.day}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Floating Tooltip Mini saat Hover */}
                {hoveredDay && hoveredDay[type] > 0 && (
                    <div
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-black/10 bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-md transition-all backdrop-blur-xs"
                        style={{
                            left: `${(paddingLeft + (hoveredDay.day - 1) * stepX) / (svgWidth / 100)}%`,
                            top: `${getY(hoveredDay[type]) - 8}px`,
                        }}
                    >
                        <div
                            className={
                                isIncome ? "text-[#4B7B5D]" : "text-[#B54A3F]"
                            }
                        >
                            {isIncome ? "+" : "-"}
                            {formatRupiah(hoveredDay[type])}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="p-6 space-y-6">
            {/* 1. Header Utama & Tab Switcher yang Rapi */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-black/5">
                <div>
                    <h3 className="font-[Fraunces] text-xl font-semibold text-[#2B2724]">
                        Tren Arus Kas Harian
                    </h3>
                    <p className="text-xs text-[#6B6560] mt-0.5">
                        Visualisasi pergerakan uang masuk dan keluar dengan skala
                        independen yang presisi
                    </p>
                </div>

                {/* Segmented Pill Tab (Satu baris rapi tanpa terpotong) */}
                <div className="inline-flex items-center rounded-xl border border-black/10 bg-white/80 p-1 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setViewMode("split")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                            viewMode === "split"
                                ? "bg-[#2B2724] text-white shadow-xs"
                                : "text-[#6B6560] hover:text-[#2B2724]"
                        }`}
                    >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Pisah Keduanya</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("expense")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                            viewMode === "expense"
                                ? "bg-[#B54A3F] text-white shadow-xs"
                                : "text-[#6B6560] hover:text-[#B54A3F]"
                        }`}
                    >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>Pengeluaran Saja</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("income")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                            viewMode === "income"
                                ? "bg-[#4B7B5D] text-white shadow-xs"
                                : "text-[#6B6560] hover:text-[#4B7B5D]"
                        }`}
                    >
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                        <span>Pemasukan Saja</span>
                    </button>
                </div>
            </div>

            {/* 2. Dua Sub-Panel Grafik yang Elegan */}
            <div className="space-y-6">
                {/* A. Panel Pemasukan (Garis Hijau) */}
                {(viewMode === "split" || viewMode === "income") && (
                    <div className="rounded-2xl border border-black/5 bg-[#FBF9F5]/70 p-4 transition-all">
                        {/* Sub-Header Pemasukan dengan Data Nyata */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-black/5">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4B7B5D]/10 text-[#4B7B5D]">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#4B7B5D]">
                                        Arus Kas Masuk (Pemasukan)
                                    </h4>
                                    <div className="font-[Inter] text-base font-bold tabular-nums text-[#4B7B5D]">
                                        +{formatRupiah(stats.totalIncome)}
                                    </div>
                                </div>
                            </div>

                            {stats.topIncome && (
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#4B7B5D]/20 bg-[#4B7B5D]/10 px-3 py-1 text-xs font-medium text-[#4B7B5D]">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>
                                        Puncak:{" "}
                                        <strong>
                                            {formatDate(stats.topIncome.date)} (
                                            {formatRupiah(stats.topIncome.income)}
                                            )
                                        </strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Kanvas Kurva Hijau */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[680px]">
                                {renderCurveChart(
                                    "income",
                                    scaleMaxIncome,
                                    viewMode === "split" ? 165 : 220,
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* B. Panel Pengeluaran (Garis Merah) */}
                {(viewMode === "split" || viewMode === "expense") && (
                    <div className="rounded-2xl border border-black/5 bg-[#FBF9F5]/70 p-4 transition-all">
                        {/* Sub-Header Pengeluaran dengan Data Nyata */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-black/5">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B54A3F]/10 text-[#B54A3F]">
                                    <TrendingDown className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#B54A3F]">
                                        Arus Kas Keluar (Pengeluaran)
                                    </h4>
                                    <div className="font-[Inter] text-base font-bold tabular-nums text-[#B54A3F]">
                                        -{formatRupiah(stats.totalExpense)}
                                    </div>
                                </div>
                            </div>

                            {stats.topExpense && (
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B54A3F]/20 bg-[#B54A3F]/10 px-3 py-1 text-xs font-medium text-[#B54A3F]">
                                    <Flame className="h-3.5 w-3.5" />
                                    <span>
                                        Puncak:{" "}
                                        <strong>
                                            {formatDate(stats.topExpense.date)} (
                                            {formatRupiah(
                                                stats.topExpense.expense,
                                            )}
                                            )
                                        </strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Kanvas Kurva Merah */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[680px]">
                                {renderCurveChart(
                                    "expense",
                                    scaleMaxExpense,
                                    viewMode === "split" ? 165 : 220,
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Footer Bar Ringkasan Cerdas (Smart Financial Insight) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-black/5 bg-white/70 px-4 py-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-[#6B6560]">
                    <Calendar className="h-4 w-4 text-[#C2632A]" />
                    <span>
                        Aktivitas Transaksi:{" "}
                        <strong className="text-[#2B2724]">
                            {stats.activeDaysCount} hari aktif
                        </strong>{" "}
                        dari {data.length} hari bulan ini.
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[#6B6560]">Arus Kas Bersih:</span>
                    <span
                        className={`font-[Inter] font-bold tabular-nums ${
                            stats.net >= 0 ? "text-[#4B7B5D]" : "text-[#B54A3F]"
                        }`}
                    >
                        {stats.net >= 0 ? "+" : ""}
                        {formatRupiah(stats.net)}
                    </span>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-[#6B6560]">
                        Rasio Belanja: {stats.burnRatePercent}%
                    </span>
                </div>
            </div>
        </Card>
    );
}
