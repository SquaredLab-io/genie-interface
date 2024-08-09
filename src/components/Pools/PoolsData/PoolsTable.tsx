import { useAccount } from "wagmi";
import ConnectWallet from "@components/common/ConnectWallet";
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

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

const PoolsList = <TData, TValue>({
  columns,
  data,
  loading
}: PropsType<TData, TValue>) => {
  const { isConnected } = useAccount();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Table>
      <TableHeader className="font-sans-ibm-plex">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="font-bold text-sm/[18px] text-[#5F7183]"
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
      <TableBody className="divide-y divide-[#292B31]">
        {!isConnected ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-72 text-center w-full">
              <div className="flex flex-col items-center w-full text-center gap-5">
                <span className="font-normal text-base/7 text-[#B5B5B5]">
                  Connect Wallet to view your transactions.
                </span>
                <ConnectWallet />
              </div>
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-[#232730]">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-72 text-center">
              {loading ? "Loading Pools..." : "You have no pools."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PoolsList;
