"use client";

import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import { formatUnits } from "viem";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import toUnits from "@lib/utils/formatting";
import { getDateTime, getLatestTransactions } from "./helper";
import OpenPositionsTable from "./OpenPositionsTable";
import TransactionsHistoryTable from "./TransactionsHistoryTable";
import { useTradeStore } from "@store/tradeStore";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import { Tx } from "@lib/types/portfolio";
import { cn } from "@lib/utils";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { PositionType } from "@lib/types/enums";
import ClosePositionPopover from "./ClosePositionPopover";
import { PROTOCOL, TEST_NETWORK } from "@lib/constants";

enum Tab {
  position = "position",
  history = "history"
}

const TradeData = () => {
  const { selectedPool } = useTradeStore((state) => state);

  const [selectedPosType, setSelectedPosType] = useState("");

  const { data: longPosition } = useCurrentPosition(
    PositionType.long,
    selectedPool.poolAddress
  );
  const { data: shortPosition } = useCurrentPosition(
    PositionType.short,
    selectedPool.poolAddress
  );
  // All Transactions -- LP, Open Long/Short, Close Long/Short
  const { data: txHistory, isLoading: isTxLoading } = useTxHistory();

  useEffect(() => console.log("txHistory in Tradedata", txHistory), [txHistory]);

  // User's Current Open Positions -- Long and Short
  const openPositions = useMemo((): Tx[] => {
    if (txHistory) {
      return getLatestTransactions(txHistory);
    } else {
      return new Array<Tx>();
    }
  }, [txHistory]);

  const positionColumns: ColumnDef<Tx>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-4">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = pool.split(" / ").map((asset) => asset.trim());
        const _power = formatUnits(BigInt(power), 18);
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {assets.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={`${asset} icon`}
                    width={26}
                    height={26}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-bold text-sm/5">
                  {assets.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {_power}
                </p>
              </div>
              <div className="font-normal text-sm/5 text-[#9299AA]">
                <p>
                  {PROTOCOL} • {TEST_NETWORK}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="">Side</span>,
      cell: ({ row }) => {
        const action = (row.getValue("action") as string).split(" ")[1];
        return (
          <span
            className={cn(
              action === "Long"
                ? "text-[#0AFC5C]"
                : action === "Short"
                  ? "text-[#FF3318]"
                  : ""
            )}
          >
            {action}
          </span>
        );
      }
    },
    {
      accessorKey: "size",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        // const size = formatUnits(row.getValue("size") as bigint, 18);
        const action = row.getValue("action") as string;
        if (action == "Open Long Position") return <span>{longPosition.formatted}</span>;
        else if (action == "Open Short Position")
          return <span>{toUnits(parseFloat(shortPosition.formatted), 3)}</span>;
        return <span>-</span>;
      }
    },
    {
      accessorKey: "value",
      header: () => <span>Entry/ Mark</span>,
      cell: ({ row }) => {
        // const value = parseFloat(row.getValue("value"));
        // const formatted = toDollarUnits(value, 2);
        return <span>-</span>;
      }
    },
    {
      accessorKey: "pnl",
      header: () => <span>P&L</span>,
      cell: ({ row }) => {
        // const pnlValue = parseFloat(row.getValue("pnl"));
        // const formatted = toDollarUnits(pnlValue, 2);
        const isGrowth = false;
        return <span className={cn(isGrowth && "text-[#07AE3B]")}>-</span>;
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        const action = row.original.action;
        return (
          <ClosePositionPopover
            longPos={longPosition.formatted}
            shortPos={shortPosition.formatted}
            isLong={selectedPosType == "Open Long Position" ? true : false}
          >
            <button
              className="py-1 px-[22px] text-white bg-[#32120D] font-normal text-[14px]/5 rounded-sm"
              onClick={() => {
                setSelectedPosType(action);
              }}
            >
              Close
            </button>
          </ClosePositionPopover>
        );
      }
    }
  ];

  const transactionsColumns: ColumnDef<Tx>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-4">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = pool.split(" / ");
        const _power = formatUnits(BigInt(power), 18);
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {assets.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={`${asset} icon`}
                    width={26}
                    height={26}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-bold text-sm/5">
                  {assets.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {_power}
                </p>
              </div>
              <div className="font-normal text-sm/5 text-[#9299AA]">
                <p>
                  {PROTOCOL} • {TEST_NETWORK}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "date",
      header: () => <span className="">Date/Time</span>,
      cell: ({ row }) => {
        const { dateTime } = row.original;
        const { date, time } = getDateTime(dateTime);
        return (
          <div className="flex flex-col text-left whitespace-nowrap">
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
        const formatted = toUnits(parseFloat(size), 2);
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

  const tabStyle =
    "data-[state=active]:bg-white data-[state=active]:text-black uppercase py-2 px-4";

  return (
    <div className="col-span-4 w-full font-medium text-xs leading-4 h-full border border-t border-secondary-gray">
      {/* Tab Row */}
      <Tabs defaultValue={Tab.position}>
        <TabsList className="flex flex-row justify-start rounded-none font-medium text-sm/6 font-sans-ibm-plex">
          <TabsTrigger value={Tab.position} className={tabStyle}>
            Open Positions ({openPositions.length})
          </TabsTrigger>
          <TabsTrigger value={Tab.history} className={tabStyle}>
            Order & Trade History
          </TabsTrigger>
        </TabsList>
        {/* Tab Content */}
        {/* --- Open Positions Table --- */}
        <TabsContent value={Tab.position}>
          <OpenPositionsTable
            columns={positionColumns}
            data={openPositions}
            isLoading={isTxLoading}
          />
        </TabsContent>
        {/* --- Transactions History Table --- */}
        <TabsContent value={Tab.history}>
          <TransactionsHistoryTable
            columns={transactionsColumns}
            data={txHistory ?? []}
            isLoading={isTxLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeData;
