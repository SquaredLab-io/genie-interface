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

function Marker({ label, value, fetching = false, showChange = false }: MarkerProps) {
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
        {fetching ? "-" : value}
      </span>
    </p>
  );
}

export default function TradeInfo() {
  const { tokenPrice, isFetchingPrice } = usePricesStore();
  const { selectedPool } = usePoolsStore();
  return (
    <div className="flex flex-col gap-2 mt-5 font-normal text-xs/[14px]">
      <Marker label={"Fee"} value={"0.25%"} />
      <Marker
        label={"TVL"}
        value={`${toUnits(parseFloat(tokenPrice?.tvl ?? "0") / 10 ** (selectedPool()?.underlyingDecimals ?? 18), 4)}`}
        fetching={isFetchingPrice}
      />
      <Marker
        label={"Volume (24h)"}
        value={toUnits(
          parseFloat(tokenPrice?.volume!) /
            10 ** (selectedPool()?.underlyingDecimals ?? 18),
          4
        )}
        fetching={isFetchingPrice}
      />
    </div>
  );
}
