import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DataTableProps<TData> = {
    data: TData[];
    columns: ColumnDef<TData>[];
    search?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    debounceMs?: number;

    sort?: string;
    direction?: "asc" | "desc";
    onSortChange?: (sort?: string, direction?: "asc" | "desc") => void;

    filter?: React.ReactNode;
};

export default function DataTable<TData>({
    data,
    columns,
    search = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    debounceMs = 400,
    sort,
    direction,
    onSortChange,
    filter,
}: DataTableProps<TData>) {
    const [searchValue, setSearchValue] = useState(search);
    const isFirstMount = useRef(true);
    const lastEmittedValue = useRef(search);
    const onSearchChangeRef = useRef(onSearchChange);

    useEffect(() => {
        onSearchChangeRef.current = onSearchChange;
    }, [onSearchChange]);

    // Sinkronisasi state jika prop search berubah dari luar (misal: navigasi / reset)
    useEffect(() => {
        if (search !== lastEmittedValue.current) {
            setSearchValue(search);
            lastEmittedValue.current = search;
        }
    }, [search]);

    // Debounce panggilan onSearchChange saat mengetik
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        if (searchValue === lastEmittedValue.current) {
            return;
        }

        const timer = setTimeout(() => {
            lastEmittedValue.current = searchValue;
            onSearchChangeRef.current?.(searchValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchValue, debounceMs]);

    const handleClear = () => {
        setSearchValue("");
        if (lastEmittedValue.current !== "") {
            lastEmittedValue.current = "";
            onSearchChangeRef.current?.("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (searchValue !== lastEmittedValue.current) {
                lastEmittedValue.current = searchValue;
                onSearchChangeRef.current?.(searchValue);
            }
        }
    };

    const sorting: SortingState = sort
        ? [
              {
                  id: sort,
                  desc: direction === "desc",
              },
          ]
        : [];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },

        manualSorting: true,

        onSortingChange: (updater) => {
            const nextSorting =
                typeof updater === "function" ? updater(sorting) : updater;

            const next = nextSorting[0];

            if (!next) {
                onSortChange?.(undefined, undefined);
                return;
            }

            onSortChange?.(next.id, next.desc ? "desc" : "asc");
        },
    });

    return (
        <div>
            {(onSearchChange || filter) && (
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {onSearchChange && (
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6560]" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(event) =>
                                    setSearchValue(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full rounded-xl border border-white/35 bg-white/55 pl-11 pr-10 py-2.5 text-sm text-[#2B2724] outline-none placeholder:text-[#6B6560]/70 backdrop-blur-[16px] transition focus:border-black/20 focus:bg-white/80"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    aria-label="Hapus pencarian"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#6B6560] transition hover:bg-black/5 hover:text-[#2B2724]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}
                    {/* Slot Filter di Sebelah Kanan */}
                    {filter && <div className="shrink-0">{filter}</div>}
                </div>
            )}
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/40 shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px]">
                        <thead className="bg-black/[0.02]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6B6560] ${
                                                header.column.getCanSort()
                                                    ? "cursor-pointer select-none transition hover:text-[#2B2724]"
                                                    : ""
                                            }`}
                                        >
                                            <div className="inline-flex items-center gap-1.5">
                                                <span>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                </span>
                                                {header.column.getIsSorted() ===
                                                    "asc" && (
                                                    <span className="font-bold text-[#C2632A]">
                                                        ↑
                                                    </span>
                                                )}
                                                {header.column.getIsSorted() ===
                                                    "desc" && (
                                                    <span className="font-bold text-[#C2632A]">
                                                        ↓
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody className="divide-y divide-black/5">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="transition-colors duration-150 hover:bg-black/[0.02]"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="whitespace-nowrap px-5 py-4 text-sm text-[#2B2724]"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-5 py-12 text-center text-sm text-[#6B6560]"
                                    >
                                        Belum ada data.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
