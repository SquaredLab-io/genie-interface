// Library Imports
import Script from "next/script";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
const TradeData = dynamic(() => import("@components/Trade/TradeData").then((mod) => mod.default));
const TradeFlow = dynamic(() => import("@components/Trade/TradeFlow").then((mod) => mod.default));
const MarketData = dynamic(() => import("@components/Trade/MarketData").then((mod) => mod.default));
const TradeSection = dynamic(() => import("@components/Trade/TradeSection").then((mod) => mod.default));
const AssetStatsBar = dynamic(() => import("@components/Trade/AssetStatsBar").then((mod) => mod.default));

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

      <div className="flex flex-col h-full">

        {/* top box */}
        <div className="flex-1 flex flex-row min-w-full border-t border-r border-secondary-gray">
          {/* left section -- (flexible) */}
          <div className="flex flex-col flex-grow border-t border-r border-secondary-gray">
            <AssetStatsBar />
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] w-full h-full">
              {isScriptReady && potentia ? (
                <TradeChart potentia={potentia} />
              ) : (
                <ChartLoader />
              )}
              <TradeFlow />
            </div>
          </div>

          {/* right section -- (fixed width) */}
          <div className="flex flex-grow min-w-[346px] w-[346px] max-w-[346px]">
            <TradeSection />
          </div>
        </div>

        {/* bottom box */}
        <div className="flex-1 flex flex-row flex-grow-0 border-t border-r border-secondary-gray">
          {/* left section -- (flexible) */}
          <div className="flex flex-grow border-r border-secondary-gray">
            <TradeData />
          </div>

          {/* right section -- (fixed width) */}
          <div className="flex min-w-[346px] w-[346px] max-w-[346px] border-t border-secondary-gray">
            <MarketData />
          </div>
        </div>

      </div>
    </>
  );
};

export default Trade;
