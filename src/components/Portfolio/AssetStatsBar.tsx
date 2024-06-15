import Image from "next/image";
import { cn } from "@lib/utils";
import { price_day_update, selected_token, token_price } from "./helper";
import TextGradient from "@components/common/TextGradient";

const AssetsStatsBar = () => {
  return (
    <div className="flex flex-row items-center gap-4 w-full bg-primary-gray px-[11px] py-2">
      <div className="inline-flex justify-start items-center min-w-fit">
        <Image src="/images/bitcoin.svg" width={36} height={36} alt="icon" />
        <div className="flex flex-col gap-y-1 ml-1 mr-4">
          <p className="inline-flex items-center gap-1">
            <span className="text-base/4 font-semibold">{selected_token.symbol}</span>
            <span className="font-medium text-2xs/[14px] rounded-sm py-px px-[4.5px] text-white bg-text-grad bg-gradient-blue">
              p = {selected_token.power}
            </span>
          </p>
          <span className="text-xs/4 text-light-gray">USDT Perpetual</span>
        </div>
        <button>
          <Image src="/icons/MenuDropIcon.svg" width={20} height={20} alt="menu-icon" />
        </button>
      </div>
      <span className="py-5 border-l border-[#25282C]" />
      <div className="flex flex-row items-center gap-10 xl:gap-20 w-full px-[11px] font-medium text-xs/[14px] overflow-visible z-50">
        <div className="flex flex-col items-start justify-between">
          <span className="font-semibold text-base/6 text-negative-red">
            {token_price.updated_price}
          </span>
          <span>{token_price.price}</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-dark-gray">24H Change %</span>
          <p
            className={cn(
              "inline-flex items-center gap-1",
              price_day_update.update > 0 ? "text-positive-green" : "text-negative-red"
            )}
          >
            <span>
              {price_day_update.update > 0 && "+"}
              {price_day_update.update}
            </span>
            <span>
              ({price_day_update.update > 0 && "+"}
              {price_day_update.percetage}%)
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-dark-gray">24H High</span>
          <span>71,819.60</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-dark-gray">24H Volume</span>
          <span>70,101.00</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-dark-gray">Funding Rate</span>
          <div>
            <TextGradient className="from-pure-blue to-pure-cyan">0.0105%</TextGradient>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsStatsBar;
