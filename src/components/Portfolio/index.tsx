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
        <div className="flex-1 flex flex-col w-full border-r border-secondary-gray">
          <AssetStatsBar />
          <div className="grid grid-cols-4 w-full h-[calc(100vh-135px)]">
            {isScriptReady ? <TradeChart {...defaultWidgetProps} /> : <ChartLoader />}
            <TradeFlow />
            <TradeData />
          </div>
        </div>
        {/* Right Side */}
        <div className="flex-1 flex flex-col w-full min-w-64 max-w-[346px]">
          <Trade />
          <MarketData />
        </div>
      </div>
    </>
  );
};

export default Portfolio;
