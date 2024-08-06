import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import toUnits, { toDollarUnits } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { PoolInfo } from "@squaredlab-io/sdk/src";
import { BASE_SEPOLIA } from "@lib/constants";
import { calculatePoolAge } from "@lib/utils/calculatePoolAge";

export function allPoolsColumnDef(): ColumnDef<PoolInfo>[] {
  // updateSelectedPool: (value: Pool) => void
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
        const { tvl, underlying, underlyingDecimals } = row.original;
        return (
          <span className="pl-[18px]">
            {toUnits(parseFloat(tvl ?? "0") / 10 ** underlyingDecimals, 4)} {underlying}
          </span>
        );
      }
    },
    {
      id: "volume",
      accessorKey: "volume",
      header: () => <span className="pl-[18px] pt-6">30D Volume</span>,
      cell: ({ row }) => {
        const { underlyingDecimals, vol, underlying } = row.original;
        const growth = parseFloat("0");
        return (
          <div className="pl-[18px] inline-flex gap-1">
            <span>{toUnits(parseFloat(vol ?? "0") / 10 ** underlyingDecimals, 4)}</span>{" "}
            {underlying}
            <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span>
            {/* )} */}
          </div>
        );
      }
    },
    {
      id: "fee",
      accessorKey: "fee",
      header: () => <span className="pl-10">30D Fees</span>,
      cell: ({ row }) => {
        // const fee: Amount = row.getValue("fee");
        const { fee, underlyingDecimals, underlying } = row.original;
        // const value = parseFloat(fee.value);
        const growth = parseFloat("0");
        return (
          <div className="pl-10 inline-flex gap-1">
            <span>{parseFloat(fee ?? "0") / 10 ** underlyingDecimals}</span> {underlying}
            {/* {growth !== 0 && ( */}
            <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span>
            {/* )} */}
          </div>
        );
      }
    },
    {
      id: "action",
      accessorKey: "action",
      header: () => <span className="opacity-0">Action</span>,
      cell: ({ row }) => {
        const { pool, underlying } = row.original;
        return (
          <div className="inline-flex items-center justify-end max-w-fit float-right mr-5 w-full gap-2">
            <Link href={`/pool/${underlying}`}>
              <Button variant="default" size="sm">
                Add Liquidity
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              // onClick={() => {
              //   updateSelectedPool(pool);
              // }}
            >
              <Link href="/">Trade</Link>
            </Button>
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
        return <span className="opacity-50">Chart here</span>;
      }
    },
    {
      accessorKey: "fee",
      header: () => <span>30D Fees</span>,
      cell: ({ row }) => {
        const { fee, underlying, underlyingDecimals } = row.original;
        // const value = parseFloat(fee.value);
        const growth = parseFloat("0");
        return (
          <div className="inline-flex gap-1">
            <span>{parseFloat(fee ?? "0") / 10 ** underlyingDecimals}</span> {underlying}
            {/* {growth !== 0 && ( */}
            <span
              className={cn(growth > 0 ? "text-positive-green" : "text-negative-red")}
            >
              {growth}%
            </span>
            {/* )} */}
          </div>
        );
      }
    },
    {
      accessorKey: "action",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => {
        return (
          <div className="inline-flex justify-end gap-2 max-w-fit float-right mr-5">
            <Button size="lg" variant="default">
              Deposit
            </Button>
            <Button size="sm" variant="secondary">
              More
            </Button>
          </div>
        );
      }
    }
  ];
}

// export function transactionsColumnDef(): ColumnDef<Pool>[] {
//   return [
//     {
//       id: "assets",
//       accessorKey: "assets",
//       header: () => (
//         <div className="pl-[18px] pt-6">
//           <span>Asset</span>
//         </div>
//       ),
//       cell: ({ row }) => {
//         const { underlyingTokens, power, network } = row.original;
//         return (
//           <div className="whitespace-nowrap flex flex-row gap-2 text-left font-medium pl-[18px] py-6">
//             <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-2">
//               {underlyingTokens.map((asset) => (
//                 <div
//                   key={asset.symbol}
//                   className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
//                 >
//                   <Image src={asset.icon} alt={asset.symbol} width={26} height={26} />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col gap-1 text-left">
//               <div className="inline-flex gap-2">
//                 <p className="font-bold text-sm/5">
//                   {underlyingTokens.map((asset, index) => (
//                     <>
//                       <span key={index}>{asset.symbol}</span>
//                       {underlyingTokens.length !== index + 1 && (
//                         <span className="text-[#9299AA] mx-1">/</span>
//                       )}
//                     </>
//                   ))}
//                 </p>
//                 <p className="font-medium text-xs/3 bg-[#49AFE9] py-1 px-[10px] rounded-md">
//                   p = {power}
//                 </p>
//               </div>
//               <div className="font-normal text-sm/5 text-[#9299AA]">
//                 <p>
//                   {"Potentia V1"} • {network}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       }
//     },
//     {
//       id: "txn",
//       accessorKey: "hash",
//       header: () => <span className="pt-6">Txn</span>,
//       cell: ({ row }) => {
//         return <span>{"0x56...7g"}</span>;
//       }
//     },
//     {
//       id: "amount",
//       accessorKey: "amount",
//       header: () => <span className="pt-6">Amount (USDT)</span>,
//       cell: ({ row }) => {
//         // const tvl = parseFloat(row.getValue("tvl"));
//         // const { underlyingTokens } = row.original;
//         return <span>$321.12</span>;
//       }
//     },
//     {
//       id: "fees",
//       accessorKey: "fees",
//       header: () => <span className="pt-6">Fees Earned (USDT)</span>,
//       cell: ({ row }) => {
//         // const vol: Amount = row.getValue("volume");
//         // const decimals = row.original.decimals);
//         return <span>$321.12</span>;
//       }
//     },
//     {
//       id: "total",
//       accessorKey: "total",
//       header: () => <span>Total (USDT)</span>,
//       cell: ({ row }) => {
//         const fee: Amount = row.getValue("fee");
//         // const value = parseFloat(fee.value);
//         // const growth = parseFloat(fee.growth);
//         return <span>$321.12</span>;
//       }
//     },
//     {
//       id: "action",
//       accessorKey: "action",
//       header: () => <span className="">Total (USD)</span>,
//       cell: ({ row }) => {
//         const pool = row.original;
//         return (
//           <div className="inline-flex items-center w-full gap-2">
//             <span className="">$321.12</span>
//             <span className="text-[#0AFC5C]">+18%</span>
//           </div>
//         );
//       }
//     }
//   ];
// }
