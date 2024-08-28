import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { cn } from "@lib/utils";
import { usePoolsStore } from "@store/poolsStore";

interface MarkerProps {
  label: string;
  value: string;
  fetching: boolean;
  showChange?: boolean;
}

function Marker({ label, value, fetching, showChange = false }: MarkerProps) {
  return (
    <p className={"inline-flex items-center justify-between w-full"}>
      <span className="text-[#757B80]">{label}</span>
      <span
        className={cn(
          "font-medium",
          showChange && parseFloat(value ?? "0") > 0
            ? "text-positive-green"
            : "text-negative-red"
        )}
      >
        {fetching ? "-" : value}
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
    refetchMarketData
  } = useCurrencyPrice(underlying);
  return (
    <>
    <div className="px-4 pb-4 w-full">
      <h3 className="font-medium text-sm/[54px]">Underlying Market Data</h3>
      <div className="flex flex-col gap-2 font-normal text-xs/[14px]">
        <Marker label={"Market Cap"} value={marketData ? (marketData?.market_cap ?? 0).toString() : "-"} fetching={isMarketDataLoading} />
        <Marker label={"Volume (24h)"} value={"-"} fetching={false} />
        <Marker label={"Day Change"} value={marketData ? (`${marketData.price_change_percentage_24h }%`?? 0).toString() : "-"} fetching={isMarketDataLoading} showChange={true} />
        <Marker label={"Max Total Supply"} value={marketData ? (marketData.max_supply ?? "-").toString() : "-"} fetching={isMarketDataLoading} />
      </div>
    </div>

    {/* <div className="px-4 pb-4 w-full">
      <h3 className="font-medium text-sm/[54px]">Underlying Market Data</h3>
      <div className="flex flex-col gap-2 font-normal text-xs/[14px]">
        <Marker label={"Market Cap"} value={"-"} fetching={false} />
        <Marker label={"Volume (24h)"} value={"-"} fetching={false} />
        <Marker label={"Day Change"} value={"-"} fetching={false} showChange={true} />
        <Marker label={"Max Total Supply"} value={"-"} fetching={false} />
      </div>
    </div> */}
    </>
  );
};

export default MarketData;
