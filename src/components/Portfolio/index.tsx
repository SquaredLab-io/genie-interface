import AssetsStatsBar from "./AssetStatsBar";
import TradeChart from "./TradeChart";
import MarketData from "./MarketData";
import Trade from "./Trade";

const Portfolio = () => {
  return (
    <div className="flex flex-row gap-1">
      {/* Left Side */}
      <div className="flex-1">
        <AssetsStatsBar />
        <TradeChart />
      </div>
      {/* Right Side */}
      <div className="flex-1 max-w-[400px] w-full">
        <Trade />
        <MarketData />
      </div>
    </div>
  );
};

export default Portfolio;
