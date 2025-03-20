"use client";

import { useEffect, useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Pagination from "@/components/table/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Toolbar from "./toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "updatedAt",
      desc: true,
    },
  ]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Load saved preferences after component mounts
  useEffect(() => {
    // Safe localStorage access
    try {
      // Load column visibility
      const savedVisibility = localStorage.getItem("table-columnVisibility");
      if (savedVisibility) {
        setColumnVisibility(JSON.parse(savedVisibility));
      }

      // Load pagination
      const savedPagination = localStorage.getItem("table-pagination");
      if (savedPagination) {
        setPagination(JSON.parse(savedPagination));
      }
    } catch (e) {
      console.error("Error loading table preferences:", e);
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "table-columnVisibility",
        JSON.stringify(columnVisibility),
      );
    } catch (e) {
      console.error("Error saving column visibility:", e);
    }
  }, [columnVisibility]);

  useEffect(() => {
    try {
      localStorage.setItem("table-pagination", JSON.stringify(pagination));
    } catch (e) {
      console.error("Error saving pagination:", e);
    }
  }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    //pagination
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),

    //sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    //filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    //visibility
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <>
      {/* table component */}
      <Toolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${
                        header.column.id === "actions" &&
                        "sticky right-0 w-12 bg-background"
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${
                        cell.column.id === "actions"
                          ? "sticky right-0 w-12 bg-background"
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </>
  );
};
export default DataTable;
