import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { UserPoint, UserPointRank } from "@squaredlab-io/sdk";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useAccount } from "wagmi";

interface PropsType<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

const RewardsTable = <TData, TValue>({
  columns,
  data,
  loading
}: PropsType<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const { isConnected } = useAccount();
  return (
    <div className="w-full overflow-auto mb-1">
      <Table className="leaderboard">
        <TableHeader className={"font-sans-ibm-plex"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-bold text-sm/[18px] text-header-gray text-center"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="rounded-lg">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const { id } = row.original as UserPoint | UserPointRank;
              return (
                <TableRow key={row.id} className="bg-[#142F41] rounded-xl leaderboard">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="font-bold text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-72 text-center">
                {loading ? "Loading Rewards History..." : "No Rewards found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RewardsTable;
