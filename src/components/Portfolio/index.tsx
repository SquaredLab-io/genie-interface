// Library Imports
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
// Component, Util Imports
import AssetStatsBar from "@components/Portfolio/AssetStatsBar";
import MarketData from "@components/Portfolio/MarketData";
import Trade from "@components/Portfolio/Trade";
import TradeData from "@components/Portfolio/TradeData";
import { defaultWidgetProps } from "./helper";
import ChartLoader from "./TradeChart/loader";
import TradeFlow from "./TradeFlow";

// Trading Chart Container imported dynamically
const TradeChart = dynamic(() => import("./TradeChart").then((mod) => mod.default));

const Portfolio = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  // TBR
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
        <div className="flex-1 flex flex-col border-r border-secondary-gray">
          <AssetStatsBar />
          <div className="grid grid-cols-4 w-full h-[calc(100vh-135px)]">
            {isScriptReady ? <TradeChart {...defaultWidgetProps} /> : <ChartLoader />}
            <TradeFlow />
            <TradeData />
          </div>
        </div>
        {/* Right Side */}
        <div className="flex-1 flex flex-col max-w-64 xl:max-w-[400px] w-full">
          <Trade />
          <MarketData />
        </div>
      </div>
    </>
  );
};

/**
 * <div className="flex flex-row">
        <div className="flex-1 flex flex-col gap-1 border-r border-secondary-gray">
          <AssetStatsBar />
          {isScriptReady ? <TradeChart {...defaultWidgetProps} /> : <ChartLoader />}
        </div>
        <div className="flex-1 max-w-64 xl:max-w-[400px] w-full">
          <Trade />
        </div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex-1">
          <TradeData />
        </div>
        <div className="flex-1 max-w-64 xl:max-w-[400px] w-full border-l border-secondary-gray">
          <MarketData />
        </div>
      </div>
 */

export default Portfolio;
