"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DropDownIcon from "@components/icons/DropDownIcon";
import { cn } from "@lib/utils";
import Label from "./Label";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import { GraphOptions, LiquidityOptions } from "./helper";
import PoolChart from "./Chart";
import { getCurrentDateTime } from "@lib/utils/getCurrentTime";
import { useTradeStore } from "@store/tradeStore";
import { useEffect, useState } from "react";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { PoolInfo } from "@lib/types/pools";
import { Address } from "viem";

const PoolOverview = ({ overviewPool }: { overviewPool: PoolInfo | undefined }) => {
  // const { overviewPool } = useTradeStore();
  // const [isLoading, setIsLoading] = useState(false);
  // const [timeseries, setTimeseries] = useState<Timeseries[]>([]);

  const { potentia } = usePotentiaSdk();

  const { chain } = useAccount();

  const graphTabStyle = cn(
    "py-[5px] px-3 rounded-base bg-[#232323]",
    "data-[state=active]:bg-[#202832] data-[state=active]:text-[#1766AF]"
  );

  const tradeTabStyle = cn(
    "w-1/2 py-3 text-center px-3 rounded-base",
    "data-[state=active]:border border-primary-blue data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-cyan data-[state=active]:to-primary-blue"
  );

  async function getTimeseries() {
    if (overviewPool) {
      try {
        // setIsLoading(true);
        const data = await potentia?.getTimeseries(overviewPool.poolAddr as Address);
        // console.log("timeseries data", data);
        // setTimeseries(data == undefined ? [] : data);
      } catch (error) {
        console.error("error", error);
      } finally {
        // setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    getTimeseries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentia]);

  if (!overviewPool) return <main>Pool Not Found</main>;

  const { underlying, pool, power } = overviewPool;
  const underlyingTokens = pool.split("/").map((p) => p.trim());

  return (
    <div className="w-full px-11 py-[72px]">
      {/* Header */}
      <button
        className="whitespace-nowrap flex flex-row items-center gap-3 text-left font-medium rounded-full"
        // onClick={getTimeseries}
      >
        <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-3">
          {underlyingTokens.map((asset, index) => (
            <div
              key={index}
              className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
            >
              <Image src={`/tokens/${asset.toLowerCase()}.svg`} alt={asset} width={44} height={44} />
            </div>
          ))}
        </div>
        <p className="font-extrabold text-[32px]/5">
          {underlyingTokens.map((asset, index) => (
            <>
              <span key={index}>{asset}</span>
              {underlyingTokens.length !== index + 1 && (
                <span className="text-[#9299AA] mx-2">/</span>
              )}
            </>
          ))}
        </p>
        <p className="font-medium text-xs/3 bg-[#1A3B00] pt-[4.5px] pb-[5.5px] px-3 rounded-md">
          p = {power}
        </p>
        <DropDownIcon className="ml-3" />
      </button>
      {/* Labels of Pool Information */}
      <div className="inline-flex items-center mt-4 gap-1">
        <Label text="APR : 2.61%" />
        <Label text="Fee : 0.3%" />
        {chain && <Label text={`Network : Base Sepolia`} />}
        {/* {underlyingAssets.map((asset, index) => ( */}
        <Label
          // key={index}
          text={overviewPool.underlying}
          imgSrc={`/tokens/${overviewPool.underlying.toLowerCase()}.svg`}
          link={overviewPool.poolAddr}
        />
        {/* ))} */}
      </div>
      {/* Graph and Add/Remove Liquidity Box */}
      <div className="grid grid-cols-7 gap-1 mt-10">
        <div className="col-span-5 rounded-base border border-gray-800">
          <div className="py-2 px-3">
            <Tabs defaultValue={GraphOptions.counterpart}>
              <TabsList className="inline-flex font-bold text-sm/5 gap-1">
                <TabsTrigger value={GraphOptions.counterpart} className={graphTabStyle}>
                  Counterpart Liquidity
                </TabsTrigger>
                <TabsTrigger value={GraphOptions.volume} className={graphTabStyle}>
                  Volume
                </TabsTrigger>
                <TabsTrigger value={GraphOptions.tvl} className={graphTabStyle}>
                  TVL
                </TabsTrigger>
                <TabsTrigger value={GraphOptions.crossbook} className={graphTabStyle}>
                  Cross Book
                </TabsTrigger>
              </TabsList>
              <div className="mt-6 mb-4 w-full flex flex-col gap-2">
                <h2 className="font-semibold text-2xl/5">$3382.63</h2>
                <h5 className="font-normal text-base/5">{getCurrentDateTime()}</h5>
              </div>
              <TabsContent value={GraphOptions.counterpart}>
                <PoolChart />
              </TabsContent>
              <TabsContent value={GraphOptions.volume}>Volume</TabsContent>
              <TabsContent value={GraphOptions.tvl}>TVL</TabsContent>
              <TabsContent value={GraphOptions.crossbook}>Cross Book</TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Tabs defaultValue={LiquidityOptions.add}>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PoolOverview;
