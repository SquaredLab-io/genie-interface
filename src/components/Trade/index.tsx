// Library Imports
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
// Component, Util Imports
import AssetStatsBar from "@components/Trade/AssetStatsBar";
import MarketData from "@components/Trade/MarketData";
import TradeSection from "@components/Trade/TradeSection";
import TradeData from "@components/Trade/TradeData";
import ChartLoader from "./TradeChart/loader";
import TradeFlow from "./TradeFlow";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
// import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
// import { Address } from "viem";

// Trading Chart Container imported dynamically
const TradeChart = dynamic(() => import("./TradeChart").then((mod) => mod.default));

const Trade = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const { potentia } = usePotentiaSdk();

  // TODO: To be removed
  useEffect(() => console.log("isScriptReady", isScriptReady), [isScriptReady]);

  const { selectedPool } = usePoolsStore();

  // Updated Token prices globally
  const { tokenPrices, isFetching: isTokenPricesFetching } = useTokenPrice({
    poolAddress: selectedPool()?.poolAddr,
    paused: !selectedPool()?.poolAddr
  });

  // Update current positions globally
  // const { data: positionData } = useCurrentPosition(selectedPool()?.poolAddr as Address);

  return (
    <>
      {/* <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          console.log("Chart script is ready!");
          setIsScriptReady(true);
        }}
      /> */}
      <div className="flex flex-row h-full">
        {/* Left Side */}
        <div className="flex-1 flex flex-col w-full border-r border-secondary-gray">
          <AssetStatsBar />
          <div className="grid grid-cols-4 w-full h-[calc(100vh-135px)]">
            {isScriptReady && potentia ? (
              <TradeChart potentia={potentia} />
            ) : (
              <ChartLoader />
            )}
            <TradeFlow />
            <TradeData />
          </div>
        </div>
        {/* Right Side */}
        <div className="flex-1 flex flex-col w-full min-w-64 max-w-[346px]">
          <TradeSection />
          <MarketData />
        </div>
      </div>
    </>
  );
};

export default Trade;
