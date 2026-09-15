import { Button } from "@elements/Button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@elements/Table";
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { BacktestHit } from "@utils/backtest";
import { cn } from "@utils/css";
import { PrizeRow } from "@widgets/Prizes/Row";
import * as React from "react";

const PAGE_SIZE = 10;

const columns: ColumnDef<BacktestHit>[] = [
  {
    accessorKey: "contest",
    header: () => (
      <>
        <span className="sm:hidden">Nº</span>
        <span className="hidden sm:inline">Concurso</span>
      </>
    ),
  },
  { accessorKey: "date", header: "Data" },
  { accessorKey: "best", header: "Melhor" },
  { id: "breakdown", header: "Acertos", enableSorting: false },
  { accessorKey: "prize", header: "Prêmio" },
];

export function Prizes({ hits }: { hits: BacktestHit[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "best", desc: true }]);

  const table = useReactTable({
    data: hits,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const page = table.getState().pagination.pageIndex;
  const pages = table.getPageCount();

  return (
    <div id="prizes" className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const sortable = header.column.getCanSort();
                const direction = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.id === "prize" && "text-right",
                      header.column.id === "breakdown" && "hidden md:table-cell"
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 tracking-wide uppercase transition-colors hover:text-foreground"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {direction === "asc" ? (
                          <CaretUpIcon weight="bold" className="size-3" />
                        ) : direction === "desc" ? (
                          <CaretDownIcon weight="bold" className="size-3" />
                        ) : (
                          <CaretUpDownIcon weight="bold" className="size-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <PrizeRow key={row.id} hit={row.original} />
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          <span className="text-foreground tabular-nums">{hits.length.toLocaleString("pt-BR")}</span>{" "}
          concursos teriam premiado você
        </span>
        <span className="flex items-center gap-2">
          <span className="tabular-nums">
            Página {page + 1} de {pages.toLocaleString("pt-BR")}
          </span>
          <Button
            id="prizes-prev"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            id="prizes-next"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </span>
      </div>
    </div>
  );
}
