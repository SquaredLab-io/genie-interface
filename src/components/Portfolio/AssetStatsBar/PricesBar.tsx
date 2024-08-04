import { PoolInfo } from "@squaredlab-io/sdk/src";
import { Separator } from "@components/ui/separator";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import toUnits from "@lib/utils/formatting";
import { cn } from "@lib/utils";

interface MarkerProps {
  label: string;
  value: string;
  fetching: boolean;
  showChange?: boolean;
}

interface PricesBarProps {
  selectedPool: PoolInfo | undefined;
}

function Marker({ label, value, fetching, showChange = false }: MarkerProps) {
  return (
    <p className="flex flex-col gap-[2px]">
      <span className="text-nowrap underline underline-offset-[1.5px] text-[#757B80]">
        {label}
      </span>
      <span
        className={cn(
          showChange &&
            (parseFloat(value) > 0 ? "text-positive-green" : "text-negative-red")
        )}
      >
        {fetching ? "-" : value}
      </span>
    </p>
  );
}

export default function PricesBar({ selectedPool }: PricesBarProps) {
  const underlying = selectedPool?.underlying;
  const { price, isLoading: isPriceLoading } = useCurrencyPrice(underlying);

  const { tokenPrices, isFetching: isTokenPricesFetching } = useTokenPrice({
    poolAddress: selectedPool?.poolAddr
  });

  const fundingRate = parseFloat(tokenPrices?.fundingInfo.longF.toFixed(3) ?? "0");

  return (
    <div className="flex flex-row items-center justify-start gap-6 h-full w-full px-8 xl:px-10 font-normal text-xs/4 overflow-x-auto z-50">
      <div className="inline-flex items-center gap-6">
        <p className="flex flex-col items-start justify-center gap-1 -mb-1 h-full">
          <span className="font-bold text-lg/[8px] text-white">
            {isPriceLoading ? "loading..." : price ?? "-"}
          </span>
          <span className="text-[#07AE3B]">+2.73%</span>
        </p>
        <Marker label="24h High" value={"62362.8"} fetching={isPriceLoading} />
        <Marker label="24h Low" value={"59523.0"} fetching={isPriceLoading} />
      </div>
      <Separator orientation="vertical" />
      <div className="inline-flex gap-6">
        <Marker
          label="Long Price"
          value={toUnits(parseFloat(tokenPrices?.lastLongP!), 3)}
          fetching={isTokenPricesFetching}
        />
        <Marker
          label="Short Price"
          value={toUnits(parseFloat(tokenPrices?.lastShortP!), 4)}
          fetching={isTokenPricesFetching}
        />
        <Marker
          label="Funding Rate"
          value={`${fundingRate > 0 ? "+" : "-"}${fundingRate}%`}
          fetching={isTokenPricesFetching}
          showChange
        />
        <Marker
          label={`24h Volume (${underlying})`}
          value={toUnits(
            parseFloat(tokenPrices?.volume!) /
              10 ** (selectedPool?.underlyingDecimals ?? 18),
            3
          )}
          fetching={isTokenPricesFetching}
        />
        <Marker
          label="24h Volume (USDC)"
          value={toUnits(parseFloat(tokenPrices?.dollarVol!), 3)}
          fetching={isTokenPricesFetching}
        />
      </div>
    </div>
  );
}
