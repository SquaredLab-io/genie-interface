"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DropDownIcon from "@components/icons/DropDownIcon";
import { cn } from "@lib/utils";
import Label from "./Label";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import { GraphOptions, LiquidityOptions } from "./helper";
import PoolChart from "./PoolChart";
import { getCurrentDateTime } from "@lib/utils/getCurrentTime";
import { useTradeStore } from "@store/tradeStore";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
import { LpTradeOptions } from "@lib/types/enums";
import SelectLpTrade from "./SelectLpTrade";
import { Separator } from "@components/ui/separator";
import { PoolInfo } from "@squaredlab-io/sdk/src";

const PoolHeader = ({ assets, power }: { assets: string[]; power: number }) => {
  return (
    <TokenSelectPopover size="wide">
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
  // const [isLoading, setIsLoading] = useState(false);
  // const [timeseries, setTimeseries] = useState<Timeseries[]>([]);

  const [lpTrade, setLpTrade] = useState<LpTradeOptions>(LpTradeOptions.supply);

  // const { potentia } = usePotentiaSdk();
  const { chain } = useAccount();

  const graphTabStyle = cn(
    "p-2 rounded-none bg-primary-gray", // base state
    "data-[state=active]:bg-white data-[state=active]:text-black" // active state
  );

  // const tradeTabStyle = cn(
  //   "w-1/2 py-3 text-center px-3",
  //   "data-[state=active]:border border-primary-blue data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-cyan data-[state=active]:to-primary-blue"
  // );

  // TODO: Activate this fetching function
  // Fetch the timeseries if after Potentia SDK is established
  // useEffect(() => {
  //   if (potentia) {
  //     (async () => {
  //       if (overviewPool) {
  //         try {
  //           // setIsLoading(true);
  //           const data = await potentia?.getTimeseries(overviewPool.poolAddr as Address);
  //           // console.log("timeseries data", data);
  //           // setTimeseries(data == undefined ? [] : data);
  //         } catch (error) {
  //           console.error("error", error);
  //         } finally {
  //           // setIsLoading(false);
  //         }
  //       }
  //     })();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [potentia]);

  if (!overviewPool) return <main></main>;

  const { pool, power } = overviewPool;
  const [token0, token1] = pool.split("/").map((p) => p.trim());

  return (
    <div className="overflow-auto pl-11 pt-11 h-full">
      {/* Header */}
      <PoolHeader assets={[token0, token1]} power={power} />
      {/* Labels of Pool Information */}
      <div className="inline-flex items-center mt-3 gap-1">
        <Label text="APR : 2.61%" />
        <Label text="Fee : 0.3%" />
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
              <TabsTrigger value={GraphOptions.crossbook} className={graphTabStyle}>
                Cross Book
              </TabsTrigger>
              <TabsTrigger value={GraphOptions.counterpart} className={graphTabStyle}>
                Counterpart Liquidity
              </TabsTrigger>
            </TabsList>
            <TabsContent value={GraphOptions.volume}>Volume</TabsContent>
            <TabsContent value={GraphOptions.tvl}>TVL</TabsContent>
            <TabsContent value={GraphOptions.crossbook}>Cross Book</TabsContent>
            <TabsContent value={GraphOptions.counterpart} className="h-[calc(100%-36px)]">
              <PoolChart />
            </TabsContent>
          </Tabs>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col px-4 border-y border-secondary-gray h-full">
            <header className="inline-flex items-center justify-between py-5">
              <h2 className="font-medium text-lg/6">
                {lpTrade === LpTradeOptions.supply ? "Add Liquidity" : "Remove Liquidity"}
              </h2>
              <SelectLpTrade lpTrade={lpTrade} setLpTrade={setLpTrade} />
            </header>
            <Separator className="mb-3" />
            {lpTrade === LpTradeOptions.supply ? <AddLiquidity overviewPool={overviewPool} /> : <RemoveLiquidity />}
          </div>
          {/* <Tabs defaultValue={LiquidityOptions.add}>
            <TabsList className="inline-flex font-semibold text-sm/5 w-full bg-gray-800 mb-1">
              <TabsTrigger value={LiquidityOptions.add} className={tradeTabStyle}>
                Add Liquidity
              </TabsTrigger>
              <TabsTrigger value={LiquidityOptions.remove} className={tradeTabStyle}>
                Remove Liquidity
              </TabsTrigger>
            </TabsList>
            <TabsContent value={LiquidityOptions.add}>
              <AddLiquidity />
            </TabsContent>
            <TabsContent value={LiquidityOptions.remove}>
              <RemoveLiquidity />
            </TabsContent>
          </Tabs> */}
        </div>
      </div>
    </div>
  );
};

export default PoolOverview;
