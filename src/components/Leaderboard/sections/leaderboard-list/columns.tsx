import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardData } from "../helper";
import { shortenHash } from "@lib/utils/formatting";

export const leaderboardColumns: ColumnDef<LeaderboardData>[] = [
  {
    id: "rank",
    accessorKey: "rank",
    header: () => (
      <div className="pl-6 pb-4 w-full flex items-start">
        <span>Rank</span>
      </div>
    ),
    cell: ({ row }) => {
      const { rank, address } = row.original;
      return (
        <div className="whitespace-nowrap flex flex-col gap-y-1 text-left text-sm font-bold/5 pl-6 py-3">
          <p className="text-[#00A3FF]">Your Rank: {rank}</p>
          <p className="font-normal text-[#9299AA]">{shortenHash(address)}</p>
        </div>
      );
    }
  },
  {
    id: "volume",
    accessorKey: "tradingVolume",
    header: () => (
      <div className="w-full pb-4">
        <span>Trading Volume</span>
      </div>
    ),
    cell: ({ row }) => {
      const { tradingVolume } = row.original;
      return <span className="text-center">{tradingVolume}</span>;
    }
  },
  {
    id: "pnl",
    accessorKey: "pnl",
    header: () => (
      <div className="w-full pb-4">
        <span>Total P&L</span>
      </div>
    ),
    cell: ({ row }) => {
      const { pnl } = row.original;
      return <span>{pnl}</span>;
    }
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => (
      <div className="pb-4 pr-4 w-full text-right">
        <span className="">Points</span>
      </div>
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      const growth = parseFloat("0");
      return <div className="w-full text-right pr-6 pl-6 text-[#00A3FF]">{points}</div>;
    }
  }
];
