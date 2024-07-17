import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import EmptyTable from "./EmptyTable";
import { useTradeStore } from "@store/tradeStore";
import { TradeOptions } from "@lib/types/enums";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}

const OpenPositionsTable = <TData, TValue>({
  columns,
  data,
  isLoading
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const { setTradeType } = useTradeStore();

  return (
    <Table>
      {table.getRowModel().rows?.length ? (
        <>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-sans-ibm-plex font-bold text-xs/[18px] text-[#5F7183] pt-[18px] pb-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="font-normal text-sm/4">
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-[#101F29]"
                onClick={() => {
                  const action = (row.getValue("action") as string)
                    .split(" ")[1]
                    .toLowerCase();
                  if (action == "long") {
                    setTradeType(TradeOptions.long);
                  } else {
                    setTradeType(TradeOptions.short);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-48 text-center">
              <EmptyTable isLoading={isLoading} />
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
};

export default OpenPositionsTable;
