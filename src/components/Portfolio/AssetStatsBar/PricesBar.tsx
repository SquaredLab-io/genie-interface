import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
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
  const {
    price,
    isLoading: isPriceLoading,
    volume,
    isVolLoading
  } = useCurrencyPrice(selectedPool?.underlying);
  return (
    <div className="flex flex-row items-center justify-start gap-9 w-full px-8 xl:px-10 font-normal text-xs/4 overflow-x-auto z-50">
      <p className="flex flex-col items-start min-h-fit gap-1 -mb-1">
        <span className="font-bold text-lg/[8px] text-white">
          {isPriceLoading ? "loading..." : price}
        </span>
        <span className="text-[#07AE3B]">+2.73%</span>
      </p>
      <div className="inline-flex gap-6">
        {/* <Marker label="Mark" value={"60363.3"} /> */}
        {/* <Marker label="Index" value={"60363.3"} /> */}
        <Marker label="Funding Rate" value={"+0.0100%"} />
        <Marker label="24h High" value={"62362.8"} />
        <Marker label="24h Low" value={"59523.0"} />
        <Marker label="24h Volume (BTC)" value={"100842.4"} />
        <Marker label="24h Volume (USDT)" value={"6142928091.9"} />
      </div>
    </div>
  );
}
