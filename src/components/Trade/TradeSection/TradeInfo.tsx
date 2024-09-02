import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { cn } from "@lib/utils";
import toUnits from "@lib/utils/formatting";
import { usePoolsStore } from "@store/poolsStore";
import { usePricesStore } from "@store/tradeStore";

interface MarkerProps {
  label: string;
  value: string;
  fetching?: boolean;
  showChange?: boolean;
}

export function Marker({ label, value, fetching = false, showChange = false }: MarkerProps) {
  return (
    <p className="inline-flex items-center justify-between w-full">
      <span className="text-[#6D6D6D]">{label}</span>
      <span
        className={cn(
          "font-medium",
          showChange ? parseFloat(value ?? "0") > 0
            ? "text-positive-green"
            : "text-negative-red" : "text-white"
        )}
      >
        {fetching && !value ? "-" : value}
      </span>
    </p>
  );
}

export default function TradeInfo() {
  const { selectedPool } = usePoolsStore();

  const { tokenPrices: tokenPrice, isFetching: isFetchingPrice } = useTokenPrice({
    poolAddress: selectedPool()?.poolAddr
  });

  return (
    <div className="flex flex-col gap-2 mt-5 font-normal text-xs/[14px]">
      <Marker label={"Fee"} value={"-"} />
      <Marker
        label={"TVL"}
        value={`${toUnits(parseFloat(tokenPrice?.tvl ?? "0") / 10 ** (selectedPool()?.underlyingDecimals ?? 18), 3)}`}
        fetching={isFetchingPrice}
      />
      <Marker
        label={"Volume (24h)"}
        value={toUnits(
          parseFloat(tokenPrice?.volume!) /
            10 ** (selectedPool()?.underlyingDecimals ?? 18),
          3
        )}
        fetching={isFetchingPrice}
      />
    </div>
  );
}
