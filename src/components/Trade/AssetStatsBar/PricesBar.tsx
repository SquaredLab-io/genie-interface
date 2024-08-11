import { memo } from "react";
import BigNumber from "bignumber.js";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { Separator } from "@components/ui/separator";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import toUnits from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { usePricesStore } from "@store/tradeStore";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";

interface MarkerProps {
  label: string;
  value: string;
  fetching: boolean;
  subValue?: string;
  showChange?: boolean;
}

interface PricesBarProps {
  selectedPool: PoolInfo | undefined;
}

function Marker({ label, value, fetching, subValue, showChange = false }: MarkerProps) {
  const _subValue = subValue ? parseFloat(subValue) : undefined;
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="text-nowrap underline underline-offset-[1.5px] text-[#757B80]">
        {label}
      </span>
      <div className="inline-flex items-center gap-x-1">
        <span
          className={cn(
            showChange &&
              (parseFloat(value) > 0 ? "text-positive-green" : "text-negative-red")
          )}
        >
          {(fetching && !value) || value === "0" ? "-" : value}
        </span>
        {_subValue && (
          <span
            className={cn(_subValue > 0 ? "text-positive-green" : "text-negative-red")}
          >
            ({_subValue > 0 && "+"}
            {_subValue === 0 ? "-" : _subValue}%)
          </span>
        )}
      </div>
    </div>
  );
}

const PricesBar = ({ selectedPool }: PricesBarProps) => {
  const underlying = selectedPool?.underlying;
  const { price, isLoading: isPriceLoading } = useCurrencyPrice(underlying);

  const { tokenPrices, isFetching, status } = useTokenPrice({
    poolAddress: selectedPool?.poolAddr
  });
  // const { tokenPrice: tokenPrices, isFetchingPrice: isTokenPricesFetching } =
  //   usePricesStore();

  const fundingRateLong = parseFloat(
    new BigNumber(tokenPrices?.fundingInfo.longF ?? 0)?.toFixed(3) ?? "0"
  );
  const fundingRateShort = parseFloat(
    new BigNumber(tokenPrices?.fundingInfo.shortF ?? 0)?.toFixed(3) ?? "0"
  );

  return (
    <div className="flex flex-row items-center justify-start gap-6 h-full w-full px-2 xl:px-8 font-normal text-xs/4 overflow-x-auto z-50">
      <div className="inline-flex items-center gap-6">
        <p className="flex flex-col items-start justify-center gap-1 -mb-1 h-full">
          <span className="font-bold text-lg/[8px] text-white">
            {isPriceLoading ? "loading..." : price ?? "-"}
          </span>
          {/* TODO: Calculate and replace original price's 24h change  */}
          <span className="text-[#07AE3B]">+2.73%</span>
        </p>
        <Marker label="24h High" value={"62362.8"} fetching={isPriceLoading} />
        <Marker label="24h Low" value={"59523.0"} fetching={isPriceLoading} />
      </div>
      <Separator orientation="vertical" />
      <div className="inline-flex gap-6">
        <Marker
          label="Long Price"
          value={toUnits(parseFloat(tokenPrices?.lastLongP!), 2)}
          subValue={toUnits(parseFloat(tokenPrices?.longDailyChange!), 2)}
          fetching={isFetching}
        />
        <Marker
          label="Short Price"
          value={toUnits(parseFloat(tokenPrices?.lastShortP!), 2)}
          subValue={toUnits(parseFloat(tokenPrices?.shortDailyChange!), 2)}
          fetching={isFetching}
        />
        <Marker
          label="Funding Rate Long"
          value={`${fundingRateLong > 0 ? "+" : ""}${fundingRateLong ?? "-"}%`}
          fetching={isFetching}
          showChange
        />
        {/* <Marker
          label="Funding Rate Short"
          value={`${fundingRateShort > 0 ? "+" : ""}${fundingRateShort}%`}
          fetching={isTokenPricesFetching}
          showChange
        /> */}
        <Marker
          label={`24h Volume (${underlying})`}
          value={toUnits(
            parseFloat(tokenPrices?.volume!) /
              10 ** (selectedPool?.underlyingDecimals ?? 18),
            3
          )}
          fetching={isFetching}
        />
        <Marker
          label="24h Volume (USDC)"
          value={toUnits(parseFloat(tokenPrices?.dollarVol!), 3)}
          fetching={isFetching}
        />
      </div>
    </div>
  );
};

export default memo(PricesBar);
