// Library Imports
import { useRef, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
// Component, Util Imports
import ChartLoader from "./TradeChart/loader";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";

// Trading Interface Sections imported dynamically
const TradeChart = dynamic(() => import("./TradeChart").then((mod) => mod.default));
const TradeData = dynamic(() =>
  import("@components/Trade/TradeData").then((mod) => mod.default)
);
const TradeFlow = dynamic(() =>
  import("@components/Trade/TradeFlow").then((mod) => mod.default)
);
const MarketData = dynamic(() =>
  import("@components/Trade/MarketData").then((mod) => mod.default)
);
const TradeSection = dynamic(() =>
  import("@components/Trade/TradeSection").then((mod) => mod.default)
);
const AssetStatsBar = dynamic(() =>
  import("@components/Trade/AssetStatsBar").then((mod) => mod.default)
);

const Trade = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const { potentia } = usePotentiaSdk();

  const tradeDataContainerRef = useRef<HTMLDivElement>(null);

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
      <div className="flex flex-col h-full flex-auto flex-grow">
        {/* top box */}
        <div className="flex-auto flex flex-row min-w-full">
          {/* left section -- (flexible) */}
          <div className="flex flex-col flex-auto max-w-[calc(100vw-346px)] border-r border-t border-secondary-gray">
            <AssetStatsBar />
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full h-full">
              {isScriptReady && potentia ? (
                <TradeChart potentia={potentia} />
              ) : (
                <ChartLoader />
              )}
              {/* <TradeFlow /> */}
            </div>
          </div>

          {/* right section -- (fixed width) */}
          <div className="flex flex-auto flex-grow min-w-[346px] w-[346px] max-w-[346px]">
            <TradeSection />
          </div>
        </div>

        {/* bottom box */}
        <div className="flex flex-auto flex-row border-t border-secondary-gray">
          {/* left section -- (flexible) */}
          <div
            ref={tradeDataContainerRef}
            className="flex flex-auto border-r border-secondary-gray"
          >
            <TradeData containerRef={tradeDataContainerRef} />
          </div>
          {/* right section -- (fixed width) */}
          <div className="flex flex-initial min-w-[346px] w-[346px] max-w-[346px]">
            <MarketData />
          </div>
        </div>
      </div>
    </>
  );
};

export default Trade;
