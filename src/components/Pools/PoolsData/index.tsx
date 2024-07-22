"use client";

// Library Imports
import Image from "next/image";
import { TabsList } from "@radix-ui/react-tabs";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon, SearchIcon } from "lucide-react";
// Component Imports
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsTrigger } from "@components/ui/tabs";
import PoolsTable from "./PoolsTable";
// Library, Store Imports
import { Amount } from "@lib/types/pools";
import { toDollarUnits } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { potentiaPoolsList } from "@lib/pools";
import { Pool } from "@lib/types/common";
import { usePools } from "@lib/hooks/usePools";
import { useTradeStore } from "@store/tradeStore";
import { TableOptions } from "./helper";
import { useEffect, useState } from "react";
import { getAllPools } from "./pool-columns";
import { usePoolsStore } from "@store/poolsStore";
import SearchInput from "./SearchInput";
import { useFilteredPools } from "@components/common/TokenSelectPopover/useFilteredPools";

const PoolsData = () => {
  const { updatePoolsData } = usePoolsStore();
  const [showSearch, setShowSearch] = useState(false);
  const [term, setTerm] = useState("");

  const { pools, isFetching } = usePools();

  const { pools: _pools, noPools } = useFilteredPools(potentiaPoolsList, term);

  useEffect(() => {
    if (pools.length) {
      // If there're pools, update it globally
      updatePoolsData(pools);
      console.log("pools updated", pools);
    }
  }, [pools]);

  const { updateSelectedPool } = useTradeStore();

  const userPoolsColumns: ColumnDef<Pool>[] = [
    {
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
        const fee: Amount = row.getValue("fee");
        const value = parseFloat(fee.value);
        const growth = parseFloat(fee.growth);
        return (
          <div className="inline-flex gap-1">
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

  const transactionColumns: ColumnDef<Pool>[] = [
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
      id: "txn",
      accessorKey: "hash",
      header: () => <span className="pt-6">Txn</span>,
      cell: ({ row }) => {
        return <span>{"0x56...7g"}</span>;
      }
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: () => <span className="pt-6">Amount (USDT)</span>,
      cell: ({ row }) => {
        // const tvl = parseFloat(row.getValue("tvl"));
        // const { underlyingTokens } = row.original;
        return <span>$321.12</span>;
      }
    },
    {
      id: "fees",
      accessorKey: "fees",
      header: () => <span className="pt-6">Fees Earned (USDT)</span>,
      cell: ({ row }) => {
        // const vol: Amount = row.getValue("volume");
        // const decimals = row.original.decimals);
        return <span>$321.12</span>;
      }
    },
    {
      id: "total",
      accessorKey: "total",
      header: () => <span>Total (USDT)</span>,
      cell: ({ row }) => {
        const fee: Amount = row.getValue("fee");
        // const value = parseFloat(fee.value);
        // const growth = parseFloat(fee.growth);
        return <span>$321.12</span>;
      }
    },
    {
      id: "action",
      accessorKey: "action",
      header: () => <span className="">Total (USD)</span>,
      cell: ({ row }) => {
        const pool = row.original;
        return (
          <div className="inline-flex items-center w-full gap-2">
            <span className="">$321.12</span>
            <span className="text-[#0AFC5C]">+18%</span>
          </div>
        );
      }
    }
  ];

  const poolsColumns = getAllPools(updateSelectedPool);

  const activeTabStyle =
    "py-2 px-4 data-[state=active]:border data-[state=active]:border-[#00A0FC] rounded-lg data-[state=active]:bg-[#0A344D]";

  return (
    <div className="py-10">
      <Tabs defaultValue={TableOptions.all}>
        <div className="inline-flex items-center justify-between w-full font-medium text-sm/5 py-4 border-t border-b border-secondary-gray">
          <TabsList className="inline-flex">
            <TabsTrigger value={TableOptions.all} className={cn(activeTabStyle)}>
              All Pools
            </TabsTrigger>
            <TabsTrigger value={TableOptions.my} className={cn(activeTabStyle)}>
              My Pools
            </TabsTrigger>
            <TabsTrigger value={TableOptions.trxn} className={cn(activeTabStyle)}>
              Transactions
            </TabsTrigger>
          </TabsList>
          <div className="inline-flex items-center gap-6">
            <button className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex">
              <PlusIcon size={16} /> Create Pool
            </button>
            <SearchInput
              term={term}
              setTerm={setTerm}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
        <TabsContent value={TableOptions.all}>
          <PoolsTable columns={poolsColumns} data={_pools} />
        </TabsContent>
        <TabsContent value={TableOptions.my}>
          <PoolsTable columns={userPoolsColumns} data={_pools} />
        </TabsContent>
        <TabsContent value={TableOptions.trxn}>
          <PoolsTable columns={transactionColumns} data={potentiaPoolsList} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PoolsData;
