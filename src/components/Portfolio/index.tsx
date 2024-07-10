// Library Imports
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Script from "next/script";
// Component, Util Imports
import AssetStatsBar from "@components/Portfolio/AssetStatsBar";
import MarketData from "@components/Portfolio/MarketData";
import Trade from "@components/Portfolio/Trade";
import TradeData from "@components/Portfolio/TradeData";
import { defaultWidgetProps } from "./helper";
import ChartLoader from "./TradeChart/loader";

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
      <div className="flex flex-row">
        {/* Left Side */}
        <div className="flex-1 flex flex-col gap-1 max-h-screen border-r border-[#1F2D3F]">
          <AssetStatsBar />
          {isScriptReady ? <TradeChart {...defaultWidgetProps} /> : <ChartLoader />}
        </div>
        {/* Right Side */}
        <div className="flex-1 max-w-64 xl:max-w-[400px] w-full">
          <Trade />
          <MarketData />
        </div>
      </div>
      <TradeData />
    </>
  );
};

export default Portfolio;
