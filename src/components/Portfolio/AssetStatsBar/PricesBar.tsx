import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { Pool } from "@lib/types/common";
import { cn } from "@lib/utils";
import toUnits from "@lib/utils/formatting";

export default function PricesBar({ selectedPool }: { selectedPool: Pool }) {
  const {
    price,
    isLoading: isPriceLoading,
    volume,
    isVolLoading
  } = useCurrencyPrice(selectedPool.underlyingTokens[0].symbol);
  return (
    <div className="flex flex-row items-center gap-10 xl:gap-20 w-full px-10 py-[11px] font-normal text-xs/4 overflow-x-auto z-50">
      <div className="flex flex-col items-start justify-between gap-[2px] border h-full">
        <span className="font-bold text-lg/[8px] text-white">
          {isPriceLoading ? "loading..." : price}
        </span>
        <span className="text-[#07AE3B]">+2.73%</span>
        {/* <span className="text-[#07AE3B]">{isPriceLoading ? "loading..." : price}</span> */}
      </div>
      <div className="flex flex-col items-start justify-between gap-[4.5px]">
        <span className="font-normal text-xs text-dark-gray">24H Change %</span>
        <p
          className={cn(
            "inline-flex items-center gap-1"
            // price_day_update.update > 0 ? "text-positive-green" : "text-negative-red"
          )}
        >
          -
          {/* <span>
              {price_day_update.update > 0 && "+"}
              {price_day_update.update}
            </span>
            <span>
              ({price_day_update.update > 0 && "+"}
              {price_day_update.percetage}%)
            </span> */}
        </p>
      </div>
      <div className="flex flex-col items-start justify-between gap-[4.5px]">
        <span className="font-normal text-xs text-dark-gray">24H High</span>
        <span>{price}</span>
      </div>
      <div className="flex flex-col items-start justify-between gap-[4.5px]">
        <span className="font-normal text-xs text-dark-gray">24H Volume</span>
        <span>${toUnits(parseFloat(volume?.top_tier_volume_total), 2)}</span>
      </div>
      {/* <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-dark-gray">Funding Rate</span>
          <span className="text-gradient-blue">0.0105%</span>
        </div> */}
    </div>
  );
}
