import { Separator } from "@components/ui/separator";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import toUnits from "@lib/utils/formatting";
import { PoolInfo } from "@squaredlab-io/sdk/src";

interface MarkerProps {
  label: string;
  value: string;
}

interface PricesBarProps {
  selectedPool: PoolInfo | undefined;
}

function Marker({ label, value }: MarkerProps) {
  return (
    <p className="flex flex-col gap-[2px]">
      <span className="text-nowrap underline underline-offset-[1.5px] text-[#757B80]">
        {label}
      </span>
      <span>{value}</span>
    </p>
  );
}

export default function PricesBar({ selectedPool }: PricesBarProps) {
  const underlying = selectedPool?.underlying;
  const { price, isLoading: isPriceLoading } = useCurrencyPrice(underlying);

  const {
    tokenPrices,
    isFetching: isTokenPricesFetching,
    refetch
  } = useTokenPrice({
    poolAddress: selectedPool?.poolAddr
  });

  return (
    <div className="flex flex-row items-center justify-start gap-6 w-full px-8 xl:px-10 font-normal text-xs/4 overflow-x-auto z-50">
      <div className="inline-flex items-center gap-6">
        <p className="flex flex-col items-start justify-center gap-1">
          <span className="font-bold text-lg/[8px] text-white">
            {isPriceLoading ? "loading..." : price ?? "-"}
          </span>
          <span className="text-[#07AE3B]">+2.73%</span>
        </p>
        <Marker label="24h High" value={"62362.8"} />
        <Marker label="24h Low" value={"59523.0"} />
      </div>
      {/* <Separator orientation="vertical" /> */}
      <div className="inline-flex gap-6">
        <Marker
          label="Long Price"
          value={
            tokenPrices?.lastLongP ? toUnits(parseFloat(tokenPrices?.lastLongP), 3) : "-"
          }
        />
        <Marker
          label="Short Price"
          value={
            tokenPrices?.lastShortP
              ? toUnits(parseFloat(tokenPrices?.lastShortP), 4)
              : "-"
          }
        />
        <Marker label="Funding Rate" value={"+0.0100%"} />
        <Marker
          label={`24h Volume (${underlying})`}
          value={tokenPrices?.volume ? toUnits(parseFloat(tokenPrices?.volume), 3) : "-"}
        />
        <Marker
          label="24h Volume (USDC)"
          value={
            tokenPrices?.dollarVol ? toUnits(parseFloat(tokenPrices?.dollarVol), 3) : "-"
          }
        />
      </div>
    </div>
  );
}
