"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { formatUnits } from "viem";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import toUnits, {
  formatOraclePrice,
  formatTimestamp,
  getDecimalAdjusted
} from "@lib/utils/formatting";
import { getClosedTransactions, getOpenTransactions } from "./helper";
import OpenPositionsTable from "./OpenPositionsTable";
import TradeHistoryTable from "./TradeHistoryTable";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import { cn } from "@lib/utils";
import ClosePositionPopover from "./ClosePositionPopover";
import { BASE_SEPOLIA } from "@lib/constants";
import { usePoolsStore } from "@store/poolsStore";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import { OpenPositionInfo, Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useAccount } from "wagmi";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";

enum Tab {
  position = "position",
  history = "history"
}

const TradeData = () => {
  const { selectedPool } = usePoolsStore();
  const { isConnected } = useAccount();

  // All Transactions -- LP, Open Long/Short, Close Long/Short
  const { data: txHistory, isLoading: isTxLoading } = useTxHistory();
  const { data: tradeHistory, isFetching: isTradeLoading } = useTradeHistory();

  const {
    openOrders,
    isFetching: loadingOpenOrders,
    refetch: refetchOpenOrders
  } = useOpenOrders({ poolAddress: selectedPool()?.poolAddr! });

  const openPositions = useMemo(() => getOpenTransactions(openOrders), [openOrders]);
  const closedPositions = useMemo(
    () => getClosedTransactions(tradeHistory),
    [tradeHistory]
  );

  const longPosition = openOrders?.longPositionTab?.tokenSize;
  const shortPosition = openOrders?.shortPositionTab?.tokenSize;

  const longTokenBalance = toUnits(getDecimalAdjusted(longPosition, 18), 3);
  const shortTokenBalance = toUnits(getDecimalAdjusted(shortPosition, 18), 3);

  const positionColumns: ColumnDef<OpenPositionInfo>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-4">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const assets = selectedPool()
          ?.pool.split(" / ")
          .map((asset) => asset.trim());
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {assets?.map((asset) => (
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
                  {assets?.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {selectedPool()?.power}
                </p>
              </div>
              <div className="font-normal text-sm/5 text-[#9299AA]">
                <p>
                  {BASE_SEPOLIA.PROTOCOL} • {BASE_SEPOLIA.NAME}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "side",
      header: () => <span className="ml-10">Side</span>,
      cell: ({ row }) => {
        const side = row.original.side;
        return (
          <span
            className={cn(
              "w-full ml-10",
              side === "Long"
                ? "text-[#0AFC5C]"
                : side === "Short"
                  ? "text-[#FF3318]"
                  : ""
            )}
          >
            {side as string}
          </span>
        );
      }
    },
    {
      accessorKey: "size",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        const { tokenSize } = row.original;
        return (
          <span>
            {toUnits(
              getDecimalAdjusted(tokenSize, selectedPool()?.underlyingDecimals!),
              3
            )}
          </span>
        );
      }
    },
    {
      accessorKey: "pnl",
      header: () => <span>P&L</span>,
      cell: ({ row }) => {
        const pAndLAmt = parseFloat(row.original.PAndLAmtInDollars ?? "0");
        const pAndLPercent = parseFloat(row.original.PAndLPercent ?? "0");
        return (
          <p className="flex flex-col gap-1 items-start">
            <span
              className={cn(
                pAndLPercent == 0
                  ? "text-gray-200"
                  : pAndLPercent > 0
                    ? "text-[#0AFC5C]"
                    : "text-[#FF3318]"
              )}
            >
              ${toUnits(pAndLAmt, 3)}
            </span>
            <span
              className={cn(
                "font-normal text-xs/4",
                pAndLPercent > 0 ? "text-[#07AE3B]" : "text-[#F23645]"
              )}
            >
              {pAndLPercent.toFixed(3)}%
            </span>
          </p>
        );
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        const side = row.original.side;
        return (
          <ClosePositionPopover
            positions={openOrders}
            isLong={side === "Long" ? true : false}
          >
            <button className="py-1 px-[22px] text-white bg-[#32120D] font-normal text-[14px]/5 rounded-sm">
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
                  {BASE_SEPOLIA.PROTOCOL} • {BASE_SEPOLIA.NAME}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="ml-10">Side</span>,
      cell: ({ row }) => {
        // const action = (row.getValue("action") as string).split(" ")[1];
        const action = row.original.action === "CL" ? "Long" : "Short";
        return (
          <span
            className={cn(
              "w-full ml-10",
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
        const { action, oraclePrice, underlying } = row.original;
        const tokenPrice = formatOraclePrice(oraclePrice, underlying.decimals);
        if (action === "CL")
          return (
            <p className="flex flex-col items-start">
              <span>
                {longTokenBalance} {underlying.symbol}
              </span>
              <span className="text-[#9299AA] text-xs">
                ${toUnits(tokenPrice * parseFloat(longTokenBalance), 3)}
              </span>
            </p>
          );
        else if (action === "CS")
          return (
            <p className="flex flex-col items-start">
              <span>{shortTokenBalance}</span>
              <span className="text-[#9299AA] text-xs">
                ${toUnits(tokenPrice * parseFloat(shortTokenBalance), 3)}
              </span>
            </p>
          );
        return <span>-</span>;
      }
    },
    {
      accessorKey: "time",
      header: () => <span>Time</span>,
      cell: ({ row }) => {
        const { date, time } = formatTimestamp(row.original.dateTime);
        return (
          <p className="flex flex-col items-start max-w-fit">
            <span>{date}</span>
            <span className="font-normal text-xs/4 text-[#9299AA]">{time}</span>
          </p>
        );
      }
    },
    {
      accessorKey: "pnl",
      header: () => <span>P&L</span>,
      cell: ({ row }) => {
        // const pnlValue = parseFloat(row.getValue("pnl"));
        // const formatted = toDollarUnits(pnlValue, 2);
        const isGrowth = false;
        return <span className={cn(isGrowth && "border text-[#07AE3B]")}>-</span>;
      }
    }
  ];

  const tabStyle =
    "data-[state=active]:bg-white data-[state=active]:text-black uppercase py-2 px-4";

  return (
    <div className="col-span-4 w-full font-medium text-xs leading-4 h-[276px] border-t border-secondary-gray">
      {/* Tab Row */}
      <Tabs defaultValue={Tab.position}>
        <TabsList className="flex flex-row justify-start rounded-none font-medium text-sm/6 font-sans-ibm-plex border-b border-secondary-gray">
          <TabsTrigger value={Tab.position} className={tabStyle}>
            Open Positions{loadingOpenOrders ? "..." : ""} (
            {isConnected ? openPositions.length : "0"})
          </TabsTrigger>
          <TabsTrigger value={Tab.history} className={tabStyle}>
            History
          </TabsTrigger>
        </TabsList>
        {/* Tab Content */}
        {/* --- Open Positions Table --- */}
        <TabsContent value={Tab.position} className="max-h-64 overflow-y-auto">
          <OpenPositionsTable
            columns={positionColumns}
            data={openPositions}
            isLoading={loadingOpenOrders}
          />
        </TabsContent>
        {/* --- Transactions History Table --- */}
        <TabsContent value={Tab.history} className="max-h-64 overflow-y-auto">
          <TradeHistoryTable
            columns={transactionsColumns}
            data={closedPositions}
            isLoading={isTradeLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(TradeData);
