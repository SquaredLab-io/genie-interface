/* eslint-disable react-hooks/rules-of-hooks */
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { _getDecimalAdjusted, formatNumber, getDollarQuote } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { PoolInfo, Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { BASE_SEPOLIA } from "@lib/constants";
import { calculatePoolAge } from "@lib/utils/calculatePoolAge";
import { ConstructedPoolsDataResponse } from ".";

export function poolOverviewColumnDef(
  updateSelectedPool: (value: PoolInfo) => void
): ColumnDef<ConstructedPoolsDataResponse>[] {
  return [
    {
      id: "pools",
      accessorKey: "pools",
      header: () => (
        <div className="pl-[18px] text-left">
          <span>Pools</span>
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
            <div className="flex flex-row gap-1 items-center text-left">
              <div className="inline-flex gap-2">
                <p className="font-bold text-sm/5">
                  {assets.map((asset, index) => (
                    <>
                      <span key={index}>{asset}</span>
                      {assets.length !== index + 1 && (
                        <span className="text-[#9299AA] mx-1">-</span>
                      )}
                    </>
                  ))}
                </p>
                <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
                  p = {power}
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: "price",
      accessorKey: "price",
      header: () => <span className="pr-[18px] text-right pb-2">Price</span>,
      cell: ({ row }) => {
        const { current_price } = row.original;
        return <span className="pr-[18px] block py-6">{formatNumber(current_price, true)}</span>;
      }
    },
    {
      id: "24hrChange",
      accessorKey: "24hrChange",
      header: () => <span className="pr-[18px] pt-6 pb-2">24h Change</span>,
      cell: ({ row }) => {
        const { price_change_percentage_24h } = row.original;
        return (
          <div className="block py-6 h-full">
          <span className={cn("my-6 mr-[18px] rounded-md py-1.5 px-2",
            price_change_percentage_24h > 0 ? 
            "text-positive-green bg-positive-green/5" 
            : "text-negative-red bg-negative-red/60")}
          >
            {`${price_change_percentage_24h>0?"+":"-"}${price_change_percentage_24h.toPrecision(4)}%`}
          </span>
          </div>
        );
      }
    },
    {
      id: "24hrVol",
      accessorKey: "24hrVol",
      header: () => <span className="pr-[18px] pt-6 pb-2">24h Volume</span>,
      cell: ({ row }) => {
        const { total_volume } = row.original;
        return (
          <div className="pr-[18px] gap-1 block py-6">
            <span>
              {formatNumber(total_volume, true)}
            </span>
            {/* <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
            </span> */}
          </div>
        );
      }
    }
  ];
}