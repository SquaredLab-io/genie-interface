/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { memo, RefObject, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { formatUnits } from "viem";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
  _getDecimalAdjusted,
  formatLimit,
  formatNumber,
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
import { useTokenPrice } from "@lib/hooks/useTokenPrice";

enum Tab {
  position = "position",
  history = "history"
}

const TradeData = ({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) => {
  const [tableHeight, setTableHeight] = useState<number>(235);
  const tabListRef = useRef<HTMLDivElement>(null);

  const { selectedPool, poolMap } = usePoolsStore();
  const { isConnected } = useAccount();

  // All Transactions -- LP, Open Long/Short, Close Long/Short
  const { data: tradeHistory, isFetching: isTradeLoading } = useTxHistory();
  const { openOrders, isFetching: loadingOpenOrders } = useOpenOrders({
    poolAddress: selectedPool()?.poolAddr!
  });

  const openPositions = useMemo(() => getOpenTransactions(openOrders), [openOrders]);
  const closedPositions = useMemo(
    () => getClosedTransactions(tradeHistory),
    [tradeHistory]
  );

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && tabListRef.current) {
        const newHeight =
          containerRef.current.offsetHeight - tabListRef.current.offsetHeight;
        setTableHeight(newHeight);
      }
    };
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const positionColumns: ColumnDef<OpenPositionInfo>[] = [
    {
      accessorKey: "pool",
      header: () => (
        <div className="pl-4">
          <span>Assets</span>
        </div>
      ),
      cell: ({ row }) => {
        const { pool } = row.original;
        const poolData = poolMap?.[pool];
        const assets = [poolData?.underlying, "USDC"];

        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {assets?.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset?.toLowerCase()}.svg`}
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
                  p = {poolData?.power}
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
      accessorKey: "tokenSize",
      header: () => <span>Size</span>,
      cell: ({ row }) => {
        const { tokenSize, underlyingPrice, side, pool } = row.original;
        const poolData = poolMap?.[pool];

        const { tokenPrices, isFetching } = useTokenPrice({
          poolAddress: pool
        });
        const tradePrice = tokenPrices
          ? parseFloat(side === "Long" ? tokenPrices.lastLongP : tokenPrices.lastShortP)
          : undefined;

        const size = formatLimit(
          getDecimalAdjusted(tokenSize, poolData?.decimals).toString(),
          0.01
        );
        const sizeInDollars = formatLimit(
          (
            parseFloat(underlyingPrice) *
            (tradePrice ?? 0) *
            getDecimalAdjusted(tokenSize, poolData?.decimals)
          ).toString(),
          0.001
        );

        return (
          <p className="flex flex-col items-start">
            <span>{formatNumber(size.value)}</span>
            <span className="text-[#9299AA] text-xs">
              {isFetching && !sizeInDollars
                ? "..."
                : formatNumber(sizeInDollars.value, true)}
            </span>
          </p>
        );
      }
    },
    {
      accessorKey: "PAndLAmtInDollars",
      header: () => <span>P&L</span>,
      cell: ({ row }) => {
        const pAndLAmt = formatLimit(row.original.PAndLAmtInDollars, 0.01);
        const pAndLPercent = formatLimit(row.original.PAndLPercent, 0.01);
        return (
          <p className="flex flex-col gap-1 items-start">
            <span
              className={cn(
                pAndLPercent.value == 0
                  ? "text-gray-200"
                  : pAndLPercent.value > 0
                    ? "text-[#0AFC5C]"
                    : "text-[#FF3318]"
              )}
            >
              {formatNumber(pAndLAmt.value, true)}
            </span>
            <span
              className={cn(
                "font-normal text-xs/4",
                pAndLPercent.sign ? "text-[#07AE3B]" : "text-[#F23645]"
              )}
            >
              {formatNumber(pAndLPercent.value)}%
            </span>
          </p>
        );
      }
    },
    {
      accessorKey: "profit",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        const side = row.original.side;
        const isLong = side === "Long";
        const popoverId = `popover-${row.original.pool}`; // Assuming each position has a unique id

        // Use useMemo to prevent unnecessary re-renders of ClosePositionPopover
        return useMemo(
          () => (
            <ClosePositionPopover position={row.original} isLong={isLong}>
              <button className="py-1 px-[22px] text-white bg-[#32120D] font-normal text-[14px]/5 rounded-sm">
                Close
              </button>
            </ClosePositionPopover>
          ),
          [isLong]
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
        const { action, oraclePrice, underlying, size, pool } = row.original;
        const poolData = poolMap?.[pool];

        const tokenSize = formatLimit(
          formatNumber(getDecimalAdjusted(size.toString(), poolData?.decimals)),
          0.001
        );
        const tokenPrice = formatOraclePrice(oraclePrice, underlying.decimals);
        if (action === "CL" || action === "CS")
          return (
            <p className="flex flex-col items-start">
              <span>
                {tokenSize.value} {underlying.symbol}
              </span>
              <span className="text-[#9299AA] text-xs">
                {formatNumber(tokenPrice * tokenSize.value, true)}
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
    <div className="w-full font-medium text-xs leading-4 h-[276px]">
      {/* Tab Row */}
      <Tabs defaultValue={Tab.position}>
        <TabsList
          ref={tabListRef}
          className="flex flex-row justify-start rounded-none font-medium text-sm/6 font-sans-ibm-plex border-b border-secondary-gray"
        >
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
        <TabsContent
          value={Tab.position}
          style={{ maxHeight: `${tableHeight}px` }}
          className="min-h-[235px] overflow-y-auto trade-history"
        >
          <OpenPositionsTable
            columns={positionColumns}
            data={openPositions}
            isLoading={loadingOpenOrders}
          />
        </TabsContent>
        {/* --- Transactions History Table --- */}
        <TabsContent
          value={Tab.history}
          style={{ maxHeight: `${tableHeight}px` }}
          className="min-h-[235px] overflow-y-scroll trade-history"
        >
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
