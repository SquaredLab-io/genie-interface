// Library Imports
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
// Component, Util Imports
// import AssetStatsBar from "@components/Trade/AssetStatsBar";
// import MarketData from "@components/Trade/MarketData";
// import TradeSection from "@components/Trade/TradeSection";
// import TradeData from "@components/Trade/TradeData";
// import TradeFlow from "./TradeFlow";
import ChartLoader from "./TradeChart/loader";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";

// Trading Chart Container imported dynamically
const TradeChart = dynamic(() => import("./TradeChart").then((mod) => mod.default));
const AssetStatsBar = dynamic(() => import("@components/Trade/AssetStatsBar").then((mod) => mod.default));
const MarketData = dynamic(() => import("@components/Trade/MarketData").then((mod) => mod.default));
const TradeSection = dynamic(() => import("@components/Trade/TradeSection").then((mod) => mod.default));
const TradeData = dynamic(() => import("@components/Trade/TradeData").then((mod) => mod.default));
const TradeFlow = dynamic(() => import("@components/Trade/TradeFlow").then((mod) => mod.default));

const Trade = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const { potentia } = usePotentiaSdk();

  // TODO: To be removed
  useEffect(() => console.log("isScriptReady", isScriptReady), [isScriptReady]);

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          console.log("Chart script is ready!");
          setIsScriptReady(true);
        }}
      />
      <div className="flex flex-row h-full">
        {/* Left Side */}
        <div className="flex-1 flex flex-col w-full border-t border-r border-secondary-gray">
          <AssetStatsBar />
          <div className="grid grid-cols-4 w-full">
            {isScriptReady && potentia ? (
              <TradeChart potentia={potentia} />
            ) : (
              <ChartLoader />
            )}
            <TradeFlow />
            <TradeData />
          </div>
        </div>
        {/* Right Side -- Fixed width for Right section */}
        <div className="flex-1 flex flex-col min-w-[346px] w-[346px] max-w-[346px]">
          <TradeSection />
          <MarketData />
        </div>
      </div>
    </>
  );
};

export default Trade;
