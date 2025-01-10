"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef, ColumnFiltersState,
  flexRender,
  getCoreRowModel, getFilteredRowModel, getPaginationRowModel, SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]

  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    }
  })

  return (
    <div className="rounded-md border">
      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>
            Edit and delete your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className={"pb-4"}>
              <Input
                placeholder={"Filter Products"}
                value={(table.getColumn("title"))?.getFilterValue() as string}
                onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className={"pl-5"}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
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
                        <TableCell key={cell.id} className={"pl-6"}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className={"flex justify-end gap-4 pt-4"}>

              <Button
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className={"text-xs"}
                variant={"ghost"}
              >
                <ChevronLeftIcon size={12}/>
                <span>Go to previous page</span>
              </Button>
              <Button
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                className={"text-xs"}
                variant={"ghost"}
              >
                <span>Go to next page</span>
                <ChevronRightIcon size={12}/>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
