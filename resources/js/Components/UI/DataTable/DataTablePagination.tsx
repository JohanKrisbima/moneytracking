import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DataTablePaginationProps = {
    currentPage: number;
    lastPage: number;
    total?: number;
    from?: number;
    to?: number;
    search?: string;
    sort?: string;
    direction?: "asc" | "desc";
    type?: string;
};

export default function DataTablePagination({
    currentPage,
    lastPage,
    total,
    from,
    to,
    search,
    sort,
    direction,
    type,
}: DataTablePaginationProps) {
    const goToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.get(
            window.location.pathname,
            {
                page,
                search: search || undefined,
                sort: sort || undefined,
                direction: direction || undefined,
                type: type || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getPageNumbers = (): (number | "...")[] => {
        if (lastPage <= 5) {
            return Array.from(
                { length: Math.max(lastPage, 1) },
                (_, i) => i + 1,
            );
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", lastPage];
        }

        if (currentPage >= lastPage - 2) {
            return [
                1,
                "...",
                lastPage - 3,
                lastPage - 2,
                lastPage - 1,
                lastPage,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            lastPage,
        ];
    };

    const pages = getPageNumbers();

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-4 sm:flex-row">
            {/* Info ringkasan data */}
            <div className="text-xs text-[#6B6560] sm:text-sm">
                {total !== undefined && total > 0 ? (
                    <span>
                        Menampilkan{" "}
                        <span className="font-semibold text-[#2B2724]">
                            {from ?? 1}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-semibold text-[#2B2724]">
                            {to ?? total}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-[#2B2724]">
                            {total}
                        </span>{" "}
                        data
                    </span>
                ) : (
                    <span>
                        Halaman{" "}
                        <span className="font-semibold text-[#2B2724]">
                            {currentPage}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-[#2B2724]">
                            {Math.max(lastPage, 1)}
                        </span>
                    </span>
                )}
            </div>

            {/* Tombol navigasi pagination */}
            <div className="flex items-center gap-1.5">
                {/* Tombol Sebelumnya */}
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-[#2B2724] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {/* Tombol Angka Halaman */}
                <div className="flex items-center gap-1">
                    {pages.map((page, idx) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="px-1.5 py-1 text-xs text-[#6B6560]"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                onClick={() => goToPage(page)}
                                className={`h-8 w-8 rounded-xl text-xs font-medium transition sm:h-9 sm:w-9 sm:text-sm ${
                                    page === currentPage
                                        ? "bg-[#C2632A] font-semibold text-white shadow-sm"
                                        : "border border-black/10 bg-white/60 text-[#2B2724] hover:bg-white/90"
                                }`}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>

                {/* Tombol Selanjutnya */}
                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-[#2B2724] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
