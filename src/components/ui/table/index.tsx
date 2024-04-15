import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface TableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  title: string;
}

export default function Table<TData, TValue>({
  columns,
  data,
  title,
}: TableProps<TData, TValue>) {
  const { push } = useRouter();
  const [filterUser, setFilterUser] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setFilterUser,
    state: {
      columnFilters: filterUser,
    },
  });
  return (
    <main className="lg:basis-full p-3 h-full">
      <h1 className="mb-4 font-semibold text-4xl">{title}</h1>
      <div className="w-full mb-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search value..."
          className="px-4 py-3 disabled:cursor-not-allowed border-b-2 border-b-black focus:outline-none"
          value={
            table
              .getColumn(
                title === "Products Management" ? "name_product" : "fullname"
              )
              ?.getFilterValue() as string
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            table
              .getColumn(
                title === "Products Management" ? "name_product" : "fullname"
              )
              ?.setFilterValue(e.target.value)
          }
          disabled={!table.getRowModel().rows.length}
        />
        {title === "Products Management" && (
          <Button
            type="button"
            sizes="md"
            className="flex items-center gap-3 px-4 py-3 text-lg text-white"
            onClick={() => push("/products/create_product")}
          >
            <i className="bx bxs-plus-circle text-2xl" /> Create
          </Button>
        )}
      </div>
      <div className="w-full relative overflow-auto">
        <table className="w-full border border-collapse border-gray-700 text-center">
          <thead
            className={`bg-black ${
              !table.getRowModel().rows.length && "hidden"
            }`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="capitalize px-3.5 py-5 text-white border-b border-b-gray-700"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="w-full">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3.5 py-5 border-b border-b-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr className="text-center h-32">
                <td colSpan={10}>No Data Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <Button
          type="button"
          sizes="md"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed text-white"
        >
          Prev
        </Button>
        <Button
          type="button"
          sizes="md"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed text-white"
        >
          Next
        </Button>
      </div>
    </main>
  );
}
