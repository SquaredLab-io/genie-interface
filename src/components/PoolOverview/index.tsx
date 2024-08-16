"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DropDownIcon from "@components/icons/DropDownIcon";
import { cn } from "@lib/utils";
import Label from "./Label";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import { GraphOptions } from "./helper";
// Charts
import LPChart from "./lp-charts";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
import { LpTradeOptions } from "@lib/types/enums";
import LpTradeSelector from "./lp-trade-selector";
import { Separator } from "@components/ui/separator";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { useDailyData } from "@lib/hooks/useDailyData";
import { POOL_FEE } from "./constants";

const PoolHeader = ({ assets, power }: { assets: string[]; power: number }) => {
  return (
    <TokenSelectPopover size="compact">
      <div className="whitespace-nowrap flex flex-row items-center gap-3 text-left font-medium rounded-full max-w-fit p-2 cursor-pointer">
        <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-3">
          {assets.map((asset, index) => (
            <div
              key={`${asset}_${index}`}
              className="z-0 flex overflow-hidden ring-2 ring-white rounded-full bg-neutral-800"
            >
              <Image
                src={`/tokens/${asset.toLowerCase()}.svg`}
                alt={asset}
                width={42}
                height={42}
              />
            </div>
          ))}
        </div>
        <p className="font-extrabold text-[32px]/5 text-nowrap">
          {assets[0]}
          <span className="text-[#9299AA] mx-2">/</span>
          {assets[1]}
        </p>
        <p className="font-medium text-xs/3 bg-[#49AFE9] pt-[4.5px] pb-[5.5px] px-3 rounded-md">
          p = {power}
        </p>
        <DropDownIcon className="ml-2" />
      </div>
    </TokenSelectPopover>
  );
};

const PoolOverview = ({ overviewPool }: { overviewPool: PoolInfo | undefined }) => {
  // LP Tab: Supply and Withdraw
  const [lpTrade, setLpTrade] = useState<LpTradeOptions>(LpTradeOptions.supply);

  const { chain } = useAccount();

  const { dailyData, isFetching: isFetchingDailyData } = useDailyData({
    poolAddress: overviewPool?.poolAddr as Address
  });

  // Current Open Long Position
  const {
    data: position,
    isFetching: isPositionFetching,
    refetch: refetchPosition
  } = useCurrentPosition({ poolAddress: overviewPool?.poolAddr! as Address });

  if (!overviewPool) return <main></main>;

  const { pool, power } = overviewPool;
  const [token0, token1] = pool.split("/").map((p) => p.trim());

  const graphTabStyle = cn(
    "p-2 rounded-none bg-primary-gray", // base state
    "data-[state=active]:bg-white data-[state=active]:text-black" // active state
  );

  // TODO: Get this from SDK
  const POOL_APR = 2.61;

  return (
    <div className="overflow-auto pl-11 pt-11 h-full">
      {/* Header */}
      <PoolHeader assets={[token0, token1]} power={power} />
      {/* Labels of Pool Information */}
      <div className="inline-flex items-center mt-3 gap-1">
        <Label text={`APR : ${POOL_APR}%`} />
        <Label text={`Fee : ${POOL_FEE}%`} />
        {chain && <Label text={`Network : Base Sepolia`} />}
      </div>
      {/* Graph and Add/Remove Liquidity Box */}
      <div className="grid grid-cols-7 mt-8 h-[calc(100vh-254px)]">
        <div className="col-span-5 border border-gray-800">
          <Tabs defaultValue={GraphOptions.volume} className="size-full">
            <TabsList className="inline-flex justify-start font-medium text-sm/6 w-full">
              <TabsTrigger value={GraphOptions.volume} className={graphTabStyle}>
                Volume
              </TabsTrigger>
              <TabsTrigger value={GraphOptions.tvl} className={graphTabStyle}>
                TVL
              </TabsTrigger>
              {/* <TabsTrigger value={GraphOptions.crossbook} className={graphTabStyle}>
                Cross Book
              </TabsTrigger> */}
              <TabsTrigger value={GraphOptions.counterpart} className={graphTabStyle}>
                Counterpart Liquidity
              </TabsTrigger>
            </TabsList>
            <TabsContent value={GraphOptions.volume} className="h-[calc(100%-36px)]">
              <LPChart.Vol dailyData={dailyData} loading={isFetchingDailyData} />
            </TabsContent>
            <TabsContent value={GraphOptions.tvl} className="h-[calc(100%-36px)]">
              <LPChart.TVL dailyData={dailyData} loading={isFetchingDailyData} />
            </TabsContent>
            {/* <TabsContent value={GraphOptions.crossbook}>Cross Book</TabsContent> */}
            <TabsContent value={GraphOptions.counterpart} className="h-[calc(100%-36px)]">
              <LPChart.Counterpart overviewPool={overviewPool} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col px-4 border-y border-secondary-gray h-full">
            <header className="inline-flex items-center justify-between py-5">
              <h2 className="font-medium text-lg/6">
                {lpTrade === LpTradeOptions.supply ? "Add Liquidity" : "Remove Liquidity"}
              </h2>
              <LpTradeSelector lpTrade={lpTrade} setLpTrade={setLpTrade} />
            </header>
            <Separator className="mb-3" />
            {lpTrade === LpTradeOptions.supply ? (
              <AddLiquidity overviewPool={overviewPool} />
            ) : (
              <RemoveLiquidity overviewPool={overviewPool} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolOverview;
