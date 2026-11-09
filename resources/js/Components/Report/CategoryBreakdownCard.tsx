import Card from "@/Components/UI/Card";
import type { CategoryBreakdown } from "@/Types/report";
import { formatRupiah } from "@/Utils/currency";
import { PieChart } from "lucide-react";

type Props = {
    items: CategoryBreakdown[];
    totalExpense: number;
};

export default function CategoryBreakdownCard({ items, totalExpense }: Props) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
                <div>
                    <h3 className="font-[Fraunces] text-lg font-semibold text-[#2B2724]">
                        Distribusi Pengeluaran
                    </h3>
                    <p className="text-xs text-[#6B6560] mt-0.5">
                        Alokasi pos belanja kamu pada bulan ini
                    </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B54A3F]/10 text-[#B54A3F]">
                    <PieChart className="h-4 w-4" />
                </div>
            </div>

            {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#6B6560]">
                    Belum ada data pengeluaran pada periode ini.
                </div>
            ) : (
                <div className="mt-5 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.category_id ?? "uncategorized"}
                            className="space-y-1.5"
                        >
                            {/* Baris Atas: Nama Kategori, Jumlah Transaksi, Persentase & Nominal */}
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                item.color || "#C2632A",
                                        }}
                                    />
                                    <span className="font-semibold text-[#2B2724]">
                                        {item.name}
                                    </span>
                                    <span className="text-[11px] text-[#6B6560]">
                                        ({item.count} transaksi)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-[#6B6560]">
                                        {item.percentage}%
                                    </span>
                                    <span className="font-[Inter] font-bold tabular-nums text-[#2B2724]">
                                        {formatRupiah(item.total)}
                                    </span>
                                </div>
                            </div>
                            {/* Baris Bawah: Visual Progress Bar */}
                            <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(item.percentage, 100)}%`,
                                        backgroundColor:
                                            item.color || "#C2632A",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
