import AssetsStatsBar from "./AssetStatsBar";
import TradeChart from "./TradeChart";
import MarketData from "./MarketData";
import Trade from "./Trade";
import TradeTable from "./TradeData";

const Portfolio = () => {
  return (
    <>
      <div className="flex flex-row gap-1 mb-1">
        {/* Left Side */}
        <div className="flex-1 flex flex-col gap-1">
          <AssetsStatsBar />
          <TradeChart />
        </div>
        {/* Right Side */}
        <div className="flex-1 max-w-64 xl:max-w-[400px] w-full">
          <Trade />
          <MarketData />
        </div>
      </div>
      <TradeTable />
    </>
  );
};

export default Portfolio;
