/* eslint-disable react-hooks/rules-of-hooks */
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { _getDecimalAdjusted, getDollarQuote, shortenHash } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { PoolInfo, Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { BASE_SEPOLIA } from "@lib/constants";
import { calculatePoolAge } from "@lib/utils/calculatePoolAge";
import PoolMenu from "./PoolMenu";
import { getActionType } from "@lib/utils/pools";
import { createChart, CrosshairMode } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import LoadingLogo from "@components/icons/loading-logo";
import { useDailyData } from "@lib/hooks/useDailyData";
import { getFeesTimeseries } from "@components/PoolOverview/helper";

const getCorrectLineColor = (val1: number | null, val2: number | null) => {
  switch (true) {
    case !!val1 && !!val2 && val1 > val2:
      return "#CF1800";
    case !!val1 && !!val2 && val1 < val2:
      return "#44BD22";
    default:
      return "#2962FF";
  }
};

const getGrowthPercentage = (val1: number | null, val2: number | null) => {
  switch (true) {
    case !!val1 && !!val2 && val1 > val2:
      return ((val2 - val1) * 100) / val1;
    case !!val1 && !!val2 && val1 < val2:
      return ((val2 - val1) * 100) / val1;
    case !!val1 && !!val2 && val1 === val2:
      return 0;
    default:
      return 0;
  }
};

export function allPoolsColumnDef(
  updateSelectedPool: (value: PoolInfo) => void
): ColumnDef<PoolInfo>[] {
  return [
    {
      id: "assets",
      accessorKey: "assets",
      header: () => (
        <div className="pl-[18px] pt-6">
          <span>Asset</span>
        </div>
      ),
      cell: ({ row }) => {
        const { power, pool } = row.original;
        const assets = pool.split("/").map((a) => a.trim());
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
                    alt={asset}
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
                  p = {power}
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
      id: "age",
      accessorKey: "age",
      header: () => <span className="pl-[18px]">Age</span>,
      cell: ({ row }) => {
        const { age } = row.original;
        return <span className="pl-[18px]">{calculatePoolAge(age)}</span>;
      }
    },
    {
      id: "tvl",
      accessorKey: "tvl",
      header: () => <span className="pl-[18px] pt-6">TVL</span>,
      cell: ({ row }) => {
        const { tvl, oraclePrice, underlyingDecimals } = row.original;
        return (
          <span className="pl-[18px]">
            {getDollarQuote(tvl, oraclePrice, underlyingDecimals)}
          </span>
        );
      }
    },
    {
      id: "volume",
      accessorKey: "volume",
      header: () => <span className="pl-[18px] pt-6">30D Volume</span>,
      cell: ({ row }) => {
        const { underlyingDecimals, vol, oraclePrice } = row.original;
        const growth = parseFloat("0");
        return (
          <div className="pl-[18px] inline-flex gap-1">
            <span>{getDollarQuote(vol, oraclePrice, underlyingDecimals)}</span>
            <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span>
          </div>
        );
      }
    },
    {
      id: "fee",
      accessorKey: "fee",
      header: () => <span className="pl-10">30D Fees</span>,
      cell: ({ row }) => {
        const { fee, underlyingDecimals, oraclePrice } = row.original;
        const growth = parseFloat("0");
        return (
          <div className="pl-10 inline-flex gap-1">
            <span>{getDollarQuote(fee, oraclePrice, underlyingDecimals)}</span>
            <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span>
          </div>
        );
      }
    },
    {
      id: "action",
      accessorKey: "action",
      header: () => <span className="opacity-0">Action</span>,
      cell: ({ row }) => {
        const pool = row.original;
        return (
          <div className="inline-flex items-center justify-end max-w-fit float-right mr-5 w-full gap-2">
            <Link href={`/pool/${pool.underlying}?power=${pool.power}`}>
              <Button variant="default" size="sm">
                Add Liquidity
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  updateSelectedPool(pool);
                }}
              >
                Trade
              </Button>
            </Link>
          </div>
        );
      }
    }
  ];
}

export function userPoolsColumnDef(): ColumnDef<PoolInfo>[] {
  return [
    {
      accessorKey: "assets",
      header: () => (
        <div className="pl-[18px] pt-6">
          <span>Asset</span>
        </div>
      ),
      cell: ({ row }) => {
        const { pool, power } = row.original;
        const assets = pool.split("/").map((p) => p.trim());
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
                  p = {power}
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
      accessorKey: "historical_fees",
      header: () => <span>Historical Pool Fees</span>,
      cell: ({ row }) => {
        const { poolAddr } = row.original;
        const { dailyData } = useDailyData({ poolAddress: poolAddr });
        const chartContainerRef = useRef(null);
        const [isLoadingChart, setIsLoadingChart] = useState(false);

        // Reversed as we need series in ascending order
        const timeseries = getFeesTimeseries(dailyData);
        console.log("time series 1: ", timeseries);

        useEffect(() => {
          if (chartContainerRef.current !== null) {
            // chart prep start
            setIsLoadingChart(true);

            const chart = createChart(chartContainerRef.current, {
              width: 135,
              height: 45,
              layout: {
                background: {
                  color: "transparent"
                },
                attributionLogo: false
              },
              grid: {
                vertLines: {
                  visible: false
                },
                horzLines: {
                  visible: false
                }
              },
              crosshair: {
                mode: CrosshairMode.Hidden
              },
              timeScale: {
                visible: false
              },
              rightPriceScale: {
                visible: false
              },
              handleScale: false,
              handleScroll: false
            });
            chart.timeScale().fitContent();
            const lineSeries = chart.addLineSeries({
              color:
                timeseries.length !== 0
                  ? getCorrectLineColor(
                      timeseries[0].value,
                      timeseries[timeseries.length - 1].value
                    )
                  : "#2962FF",
              lastValueVisible: false,
              priceLineVisible: false
            });
            lineSeries.setData(timeseries);
            lineSeries.priceScale().applyOptions({
              autoScale: false
            });

            setIsLoadingChart(false);

            return () => {
              chart.remove();
            };
          }
        }, [timeseries]);

        return (
          // <span className="opacity-50">Chart here</span>;
          <div className="relative max-h-[150px] max-w-[200px]">
            {isLoadingChart ? (
              <div className="size-full flex-col-center">
                <LoadingLogo size={80} />
              </div>
            ) : (
              <div className="h-full" ref={chartContainerRef} />
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "fee",
      header: () => <span>30D Fees</span>,
      cell: ({ row }) => {
        const { fee, underlyingDecimals, oraclePrice, poolAddr } = row.original;
        const { dailyData } = useDailyData({ poolAddress: poolAddr });

        // Reversed as we need series in ascending order
        const timeseries = getFeesTimeseries(dailyData);
        console.log("time series 2: ", timeseries);

        const growth =
          timeseries.length !== 0
            ? getGrowthPercentage(
                timeseries[0].value,
                timeseries[timeseries.length - 1].value
              )
            : 0;
        return (
          <div className="inline-flex gap-1">
            <span>{getDollarQuote(fee, oraclePrice, underlyingDecimals)}</span>
            <span
              className={cn(
                growth > 0
                  ? "text-positive-green"
                  : growth < 0
                    ? "text-negative-red"
                    : undefined
              )}
            >
              {parseFloat(growth.toFixed(1)).toPrecision(5)}%
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        const { underlying } = row.original;
        return (
          <div className="inline-flex justify-end gap-2 max-w-fit float-right mr-5">
            <Link href={`/pool/${underlying}`}>
              <Button size="lg" variant="default">
                Deposit
              </Button>
            </Link>
            <PoolMenu underlying={underlying}>
              <Button size="sm" variant="secondary">
                More
              </Button>
            </PoolMenu>
          </div>
        );
      }
    }
  ];
}

export function transactionsColumnDef(): ColumnDef<Tx>[] {
  return [
    {
      id: "assets",
      accessorKey: "assets",
      header: () => (
        <div className="pl-[18px] pt-6">
          <span>Asset</span>
        </div>
      ),
      cell: ({ row }) => {
        const { underlying, power } = row.original;
        const underlyingTokens = [underlying.symbol, "USDC"];
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {underlyingTokens.map((asset) => (
                <div
                  key={asset}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image
                    src={`/tokens/${asset.toLowerCase()}.svg`}
                    alt={asset}
                    width={26}
                    height={26}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-bold text-sm/5">
                  {underlyingTokens.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {underlyingTokens.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">/</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {_getDecimalAdjusted(power.toString(), 18)}
                </p>
              </div>
              <div className="font-normal text-sm/5 text-[#9299AA]">
                <p>
                  {"Potentia V1"} • {"Base Sepolia"}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "txn",
      accessorKey: "hash",
      header: () => <span className="pt-6">Txn</span>,
      cell: ({ row }) => {
        const { hash, action } = row.original;
        return (
          <p className="flex flex-col items-start">
            <span className="font-bold">{getActionType(action)}</span>
            <Link
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              className="text-[#9299AA] text-sm/5 hover:underline"
            >
              {shortenHash(hash)}
            </Link>
          </p>
        );
      }
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: () => <span className="pt-6">Amount (USDT)</span>,
      cell: ({ row }) => {
        const { size, oraclePrice, underlying } = row.original;
        return (
          <span>
            {/* {getDecimalAdjusted(size.toString(), underlying.decimals)} {underlying.symbol} */}
            {getDollarQuote(size.toString(), oraclePrice.toString(), underlying.decimals)}
          </span>
        );
      }
    },
    /* {
      id: "fees",
      accessorKey: "fees",
      header: () => <span className="pt-6">Fees Earned (USDT)</span>,
      cell: ({ row }) => {
        const { oraclePrice } = row.original;
        return <span>-</span>;
      }
    }, */
    {
      id: "total",
      accessorKey: "total",
      header: () => <span>Total (USDT)</span>,
      cell: ({ row }) => {
        const { size, oraclePrice } = row.original;
        // return <span>{getDecimalAdjusted(size.toString(), 18)} WETH</span>;
        return <span>{getDollarQuote(size.toString(), oraclePrice.toString(), 18)}</span>;
      }
    },
    {
      id: "action",
      accessorKey: "action",
      header: () => <span className="">Total (USD)</span>,
      cell: ({ row }) => {
        const { size, oraclePrice } = row.original;
        const growth = parseFloat("0");
        // return <span>{getDecimalAdjusted(size.toString(), 18)} WETH</span>;
        return (
          <div className="inline-flex gap-1">
            <span>{getDollarQuote(size.toString(), oraclePrice.toString(), 18)}</span>
            <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span>
          </div>
        );
      }
    }
  ];
}
