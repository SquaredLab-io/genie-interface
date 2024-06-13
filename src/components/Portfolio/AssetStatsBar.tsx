import Image from "next/image";
import { cn } from "@lib/utils";
import { price_day_update, selected_token, token_price } from "./helper";
import TextGradient from "@components/common/TextGradient";

const AssetsStatsBar = () => {
  return (
    <div className="flex flex-row items-start gap-4 w-full bg-primary-gray px-[11px] py-3">
      <div className="inline-flex items-center min-w-fit">
        <Image src="/images/bitcoin.svg" width={36} height={36} alt="icon" />
        <div className="flex flex-col gap-y-1 ml-1 mr-4">
          <p className="inline-flex items-center gap-1">
            <span className="text-base leading-4 font-semibold">
              {selected_token.symbol}
            </span>
            <span className="font-medium text-2xs rounded-sm leading-[14px] py-px px-[4.5px] text-white bg-[#0099FF]">
              p = {selected_token.power}
            </span>
          </p>
          <span className="text-xs leading-4 text-[#ADB1B8]">USDT Perpetual</span>
        </div>
        <button>
          <Image src="/icons/MenuDropIcon.svg" width={20} height={20} alt="menu-icon" />
        </button>
      </div>
      <span className="py-5 border-l border-[#25282C]" />
      <div className="flex flex-row items-center gap-x-12 lg:gap-x-20 w-full px-[11px] font-medium text-xs leading-[14px]">
        <div className="flex flex-col items-start justify-between">
          <span className="font-semibold text-base leading-6 text-[#EF454A]">
            {token_price.updated_price}
          </span>
          <span>{token_price.price}</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-[#71757A]">24H Change %</span>
          <p
            className={cn(
              "inline-flex items-center gap-x-1",
              price_day_update.update > 0 ? "text-[#20B26C]" : "text-[#EF454A]"
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
          <span className="font-normal text-xs text-[#71757A]">24H High</span>
          <span>71,819.60</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-[#71757A]">24H Volume</span>
          <span>70,101.00</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-[4.5px]">
          <span className="font-normal text-xs text-[#71757A]">Funding Rate</span>
          <div>
            <TextGradient className="from-[#0099FF] to-[#00CCFF]">0.0105%</TextGradient>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsStatsBar;
