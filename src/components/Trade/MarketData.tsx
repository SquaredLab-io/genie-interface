import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { cn } from "@lib/utils";
import { usePoolsStore } from "@store/poolsStore";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";

interface MarkerProps {
  label: string;
  value: string;
  fetching: boolean;
  showIndicator?: boolean;
}

function Marker({ label, value, fetching, showIndicator = false }: MarkerProps) {

  const returnCorrectIndicator = () => {
    switch (true) {
      case (parseFloat(value) > 0): return <BiSolidUpArrow color="#44BD22" />;
      case (parseFloat(value) < 0): return <BiSolidDownArrow color="#CF1800" />;
      default: return null;
    }
  }

  return (
    <p className={"inline-flex items-center justify-between w-full"}>
      <span className="text-[#757B80]">{label}</span>
      <span className={cn("font-medium text-white")}>
        {
          fetching
            ?
            "-"
            :
            showIndicator ? <span className="inline-flex gap-1">{returnCorrectIndicator()}{value}</span> : value
        }
      </span>
    </p>
  );
}

const MarketData = () => {
  const { selectedPool } = usePoolsStore();
  const underlying = selectedPool()?.underlying;
  const {
    marketData,
    isMarketDataLoading,
    _symbol
  } = useCurrencyPrice(underlying);
  return (
    <div className="px-4 pb-4 w-full">
      <h3 className="font-medium text-sm/[54px]">Underlying Market Data</h3>
      <div className="flex flex-col gap-2 font-normal text-xs/[14px]">
        <Marker label={"Market Cap"} value={marketData ? `${(marketData?.market_cap ?? 0)} ${_symbol}` : "-"} fetching={isMarketDataLoading} />
        <Marker label={"Volume (24h)"} value={marketData ? (`$${marketData?.total_volume}` ?? "-").toString() : "-"} fetching={isMarketDataLoading} />
        <Marker label={"Day Change"} value={marketData ? (`${marketData.price_change_percentage_24h.toPrecision(4)}%` ?? 0).toString() : "-"} fetching={isMarketDataLoading} showIndicator={true} />
        {/* <Marker label={"Max Total Supply"} value={marketData ? (marketData.max_supply ?? "-").toString() : "-"} fetching={isMarketDataLoading} /> */}
      </div>
    </div>
  );
};

export default MarketData;
