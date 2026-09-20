import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";

import { useState } from "react";

type DataTableProps<TData> = {
    data: TData[];
    columns: ColumnDef<TData>[];
};

export default function DataTable<TData>({
    data,
    columns,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),

        state: {
            sorting,
        },

        onSortingChange: setSorting,
    });

    return (
        <div className="overflow-hidden rounded-2xl border border-black/5">
            <table className="w-full">
                <thead className="bg-black/[0.02]">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#6B6560]"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                    {header.column.getIsSorted() === "asc" &&
                                        " ↑"}

                                    {header.column.getIsSorted() === "desc" &&
                                        " ↓"}
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
                                className="transition hover:bg-black/[0.015]"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-5 py-4 text-sm text-[#2B2724]"
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
    );
}
