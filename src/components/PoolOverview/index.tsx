"use client";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DropDownIcon from "@components/icons/DropDownIcon";
import { allPoolsData, Token } from "@components/Pools/PoolsData/helper";
import { cn } from "@lib/utils";
import Label from "./Label";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import { GraphOptions, TradeOptions } from "./helper";
import PoolChart from "./Chart";
import { CONTRACT_ADDRESSES } from "@lib/constants";

const PoolOverview = () => {
  const pool = allPoolsData[0];
  const { assets, power, protocol, network } = pool;

  const { chain } = useAccount();

  const graphTabStyle = cn(
    "py-[5px] px-3 rounded-base bg-[#232323]",
    "data-[state=active]:bg-[#202832] data-[state=active]:text-[#1766AF]"
  );

  const tradeTabStyle = cn(
    "w-1/2 py-3 text-center px-3 rounded-base",
    "data-[state=active]:border border-pure-blue data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-pure-cyan data-[state=active]:to-pure-blue"
  );

  return (
    <div className="w-full px-11 py-[72px]">
      {/* Header */}
      <button className="whitespace-nowrap flex flex-row items-center gap-3 text-left font-medium rounded-full">
        <div className="hidden sm:flex flex-row items-center max-w-fit -space-x-3">
          {assets.map((asset: Token, index) => (
            <div
              key={index}
              className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
            >
              <Image src={asset.imgSrc} alt={asset.symbol} width={44} height={44} />
            </div>
          ))}
        </div>
        <p className="font-extrabold text-[32px]/5">
          {assets.map((asset: Token, index) => (
            <>
              <span key={index}>{asset.symbol}</span>
              {assets.length !== index + 1 && (
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
        {chain && <Label text={`Network : ${chain?.name}`} />}
        {assets.map((asset, index) => (
          <Label
            key={index}
            text={asset.symbol}
            imgSrc={asset.imgSrc}
            link={CONTRACT_ADDRESSES.WETH_ADDR}
          />
        ))}
      </div>
      {/* Graph and Add/Remove Liquidity Box */}
      <div className="grid grid-cols-7 gap-1 mt-10">
        <div className="col-span-5 bg-primary-gray rounded-base">
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
                <h2 className="font-semibold text-2xl/5">$508.731</h2>
                <h5 className="font-normal text-base/5">Jun 12, 2024, 1:30PM</h5>
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
          <Tabs defaultValue={TradeOptions.add}>
            <TabsList className="inline-flex font-semibold text-sm/5 w-full bg-primary-gray mb-1">
              <TabsTrigger value={TradeOptions.add} className={tradeTabStyle}>
                Add Liquidity
              </TabsTrigger>
              <TabsTrigger value={TradeOptions.remove} className={tradeTabStyle}>
                Remove Liquidity
              </TabsTrigger>
            </TabsList>
            <TabsContent value={TradeOptions.add}>
              <AddLiquidity />
            </TabsContent>
            <TabsContent value={TradeOptions.remove}>
              <RemoveLiquidity />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PoolOverview;
