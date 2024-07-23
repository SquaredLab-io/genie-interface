import Link from "next/link";
import Image from "next/image";
import { Pool } from "@lib/types/common";
import { ColumnDef } from "@tanstack/react-table";
import toUnits, { toDollarUnits } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { Amount } from "@lib/types/pools";
import { Button } from "@components/ui/button";

export function getAllPools(
  // updateOverviewPool: (value: Pool) => void,
  updateSelectedPool: (value: Pool) => void
): ColumnDef<Pool>[] {
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
        const { underlyingTokens, power, network } = row.original;
        return (
          <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
            <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
              {underlyingTokens.map((asset) => (
                <div
                  key={asset.symbol}
                  className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
                >
                  <Image src={asset.icon} alt={asset.symbol} width={26} height={26} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex gap-2">
                <p className="font-bold text-sm/5">
                  {underlyingTokens.map((asset, index) => (
                    <>
                      <span key={index}>{asset.symbol}</span>
                      {underlyingTokens.length !== index + 1 && (
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
                  {"Potentia V1"} • {network}
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
      header: () => <span className="pl-[18px] pt-6">Age</span>,
      cell: ({ row }) => {
        return <span className="pl-[18px]">{row.original.age}</span>;
      }
    },
    {
      id: "tvl",
      accessorKey: "tvl",
      header: () => <span className="pl-[18px] pt-6">TVL</span>,
      cell: ({ row }) => {
        const tvl = parseFloat(row.getValue("tvl"));
        const { underlyingTokens } = row.original;
        return (
          <span className="pl-[18px]">
            {toUnits(tvl, 2)} {underlyingTokens[0].symbol}
          </span>
        );
      }
    },
    {
      id: "volume",
      accessorKey: "volume",
      header: () => <span className="pl-[18px] pt-6">30D Volume</span>,
      cell: ({ row }) => {
        const vol: Amount = row.getValue("volume");
        const decimals = row.original.decimals;
        const value = parseFloat(vol.value);
        const growth = parseFloat(vol.growth);
        return (
          <div className="pl-[18px] inline-flex gap-1">
            <span>{value / 10 ** decimals}</span>
            {growth !== 0 && (
              <span
                className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
              >
                {growth}%
              </span>
            )}
          </div>
        );
      }
    },
    {
      id: "fee",
      accessorKey: "fee",
      header: () => <span className="pl-10">30D Fees</span>,
      cell: ({ row }) => {
        const fee: Amount = row.getValue("fee");
        const value = parseFloat(fee.value);
        const growth = parseFloat(fee.growth);
        return (
          <div className="pl-10 inline-flex gap-1">
            <span>{toDollarUnits(value, 2)}</span>
            {growth !== 0 && (
              <span
                className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
              >
                {growth}%
              </span>
            )}
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
            <Link href={`/pool/${pool.underlyingTokens[0].symbol}`}>
              <Button variant="default" size="sm">
                Add Liquidity
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                updateSelectedPool(pool);
              }}
            >
              <Link href="/">Trade</Link>
            </Button>
          </div>
        );
      }
    }
  ];
}
