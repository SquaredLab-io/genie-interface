"use client";

import { useMemo } from "react";
import Image from "next/image";
import { formatUnits } from "viem";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { toDollarUnits } from "@lib/utils/formatting";
import { getDateTime } from "./helper";
import OpenPositionsTable from "./OpenPositionsTable";
import TransactionsHistoryTable from "./TransactionsHistoryTable";
import ClosePositionModal from "./ClosePositionModal";
import { useTradeStore } from "@store/tradeStore";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import { Tx } from "@lib/types/portfolio";
import { cn } from "@lib/utils";

enum Tab {
  position = "position",
  history = "history"
}

const TradeData = () => {
  const { isPositionModalOpen, setIsPositionModalOpen } = useTradeStore((state) => state);
  const { data: txHistory } = useTxHistory();

  const openPositions = useMemo((): Tx[] => {
    if (txHistory) {
      return txHistory.filter((tx) => {
        // Filter txHistory with Open Long/Short Positions
        return tx.action === "Open Long Position" || tx.action === "Open Short Position";
      });
    } else {
      return new Array<Tx>();
    }
  }, [txHistory]);

  const positionColumns: ColumnDef<Tx>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-10 pr-8 w-full border-r border-[#303030]">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = pool.split(" / ");
        const _power = formatUnits(BigInt(power), 18);
        return (
          <div className="whitespace-nowrap py-3 flex flex-row gap-2 text-left font-medium pl-10 pr-8 border-r border-[#303030]">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-1">
              {assets.map((asset: string) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-2 ring-[#E5E7EB] rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={asset}
                    width={30}
                    height={30}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-extrabold text-sm leading-5">
                  {assets.map((asset: string, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA]">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs leading-3 bg-[#1A3B00] py-[4.5px] px-[9px] rounded-md">
                  p = {_power}
                </p>
              </div>
              <p className="font-normal text-xs leading-5 text-[#6D6D6D]">Potentia V1</p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "date",
      header: () => <span className="pl-[76px]">Date/Time</span>,
      cell: ({ row }) => {
        const { dateTime } = row.original;
        const { date, time } = getDateTime(dateTime);
        return (
          <div className="flex flex-col text-left whitespace-nowrap pl-[76px]">
            <span>{date}</span>
            <span className="text-[#6D6D6D]">{time}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "size",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        const size = formatUnits(row.getValue("size") as bigint, 18);
        const formatted = toDollarUnits(parseFloat(size), 2);
        return <span>{formatted}</span>;
      }
    },
    {
      accessorKey: "value",
      header: () => <span>Value</span>,
      cell: ({ row }) => {
        // const value = parseFloat(row.getValue("value"));
        // const formatted = toDollarUnits(value, 2);
        return <span>-</span>;
      }
    },
    {
      accessorKey: "pnl",
      header: () => <span>PNL</span>,
      cell: ({ row }) => {
        // const pnlValue = parseFloat(row.getValue("pnl"));
        // const formatted = toDollarUnits(pnlValue, 2);
        const isGrowth = false;
        return <span className={cn(isGrowth && "text-[#07AE3B]")}>-</span>;
      }
    },
    {
      accessorKey: "type",
      header: () => <span>Type</span>,
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        const type = action.split(" ")[1];
        const _type = action.substring(5);
        return <span>{_type}</span>;
      }
    },
    // {
    //   accessorKey: "return",
    //   header: () => <span>%Return</span>,
    //   cell: ({ row }) => {
    //     const isGrowth = false;
    //     return <span className={cn(isGrowth && "text-[#07AE3B]")}>-</span>;
    //   }
    // },
    {
      accessorKey: "action",
      header: () => <span className="pl-4">Action</span>,
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsPositionModalOpen(true);
            }}
          >
            <span className="bg-gradient-to-r text-transparent bg-clip-text from-pure-blue to-pure-cyan">
              Close Position
            </span>
          </Button>
        );
      }
    }
  ];

  const transactionsColumns: ColumnDef<Tx>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-10 pr-8 w-full border-r border-[#303030]">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = pool.split(" / ");
        const _power = formatUnits(BigInt(power), 18);
        return (
          <div className="whitespace-nowrap py-3 flex flex-row gap-2 text-left font-medium pl-10 pr-8 border-r border-[#303030]">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-1">
              {assets.map((asset: string) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-2 ring-[#E5E7EB] rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={asset}
                    width={30}
                    height={30}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-extrabold text-sm leading-5">
                  {assets.map((asset: string, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA]">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs leading-3 bg-[#1A3B00] py-[4.5px] px-[9px] rounded-md">
                  p = {_power}
                </p>
              </div>
              <p className="font-normal text-xs leading-5 text-[#6D6D6D]">Potentia V1</p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "date",
      header: () => <span className="pl-[76px]">Date/Time</span>,
      cell: ({ row }) => {
        const { dateTime } = row.original;
        const { date, time } = getDateTime(dateTime);
        return (
          <div className="flex flex-col text-left whitespace-nowrap pl-[76px]">
            <span>{date}</span>
            <span className="text-[#6D6D6D]">{time}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "size",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        const size = formatUnits(row.getValue("size") as bigint, 18);
        const formatted = toDollarUnits(parseFloat(size), 2);
        return <span>{formatted}</span>;
      }
    },
    {
      accessorKey: "value",
      header: () => <span>Value</span>,
      cell: ({ row }) => {
        // const value = parseFloat(row.getValue("value"));
        // const formatted = toDollarUnits(value, 2);
        return <span>-</span>;
      }
    },
    {
      accessorKey: "pnl",
      header: () => <span>PNL</span>,
      cell: ({ row }) => {
        // const pnlValue = parseFloat(row.getValue("pnl"));
        // const formatted = toDollarUnits(pnlValue, 2);
        const isGrowth = false;
        return <span className={cn(isGrowth && "text-[#07AE3B]")}>-</span>;
      }
    },
    {
      accessorKey: "return",
      header: () => <span>%Return</span>,
      cell: ({ row }) => {
        const isGrowth = false;
        return <span className={cn(isGrowth && "text-[#07AE3B]")}>-</span>;
      }
    },
    {
      accessorKey: "action",
      header: () => <span>Action</span>,
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        return <span className="font-bold">{action}</span>;
      }
    }
  ];

  return (
    <div className="font-medium text-xs leading-4 bg-primary-gray font-sans-manrope">
      {/* Tab Row */}
      <Tabs defaultValue={Tab.position}>
        <TabsList className="flex flex-row justify-start gap-8 py-2 px-10 rounded-none border-b border-[#303030] font-normal text-xs leading-9">
          <TabsTrigger
            value={Tab.position}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-blue data-[state=active]:to-pure-cyan"
          >
            Open Positions
          </TabsTrigger>
          <TabsTrigger
            value={Tab.history}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-blue data-[state=active]:to-pure-cyan"
          >
            Trade History
          </TabsTrigger>
        </TabsList>
        {/* Tab Content */}
        {/* --- Open Positions Table --- */}
        <TabsContent value={Tab.position}>
          <OpenPositionsTable columns={positionColumns} data={openPositions} />
        </TabsContent>
        {/* --- Transactions History Table --- */}
        <TabsContent value={Tab.history}>
          <TransactionsHistoryTable
            columns={transactionsColumns}
            data={txHistory ?? []}
          />
        </TabsContent>
      </Tabs>
      <ClosePositionModal open={isPositionModalOpen} setOpen={setIsPositionModalOpen} />
    </div>
  );
};

export default TradeData;
