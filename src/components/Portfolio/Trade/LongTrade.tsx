import { ChangeEvent, useState } from "react";
import { selected_token } from "../helper";
import { isValidPositive } from "@lib/utils";
import { BiSolidDownArrow } from "react-icons/bi";
import { Button } from "@components/ui/button";
import TokenSlider from "./TokenSlider";

const LongTrade = () => {
  const [quantity, setQuantity] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("btc");
  const [sliderValue, setSliderValue] = useState<number[]>([25]);

  const handleSliderInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target.value;
    // When value is a positive integer and not an invalid number
    const isValid = (isValidPositive(input) && !isNaN(parseFloat(input))) || input === "";
    // Only set the value when it's valid
    if (isValid) {
      setSliderValue([parseFloat(input)]);
    }
  };

  return (
    <div className="flex flex-col font-medium text-xs leading-4">
      <div className="flex flex-col gap-1 pt-[14px] pb-2 pl-2 pr-3 border-b border-[#303030]">
        <p className="inline-flex items-center justify-between w-full">
          <span className="text-[#949E9C]">Balance</span>
          <span className="font-normal">$0.00</span>
        </p>
        <p className="inline-flex items-center justify-between w-full">
          <span className="text-[#949E9C]">Current Position</span>
          <span className="font-normal">
            125 BTC<sup>{selected_token.power}</sup>
          </span>
        </p>
        <form
          className="flex flex-col w-full gap-2 mt-3"
          autoComplete="off"
          autoCapitalize="off"
          name="token-quantity"
        >
          <label htmlFor="quantity" className="text-[#A5A5A5]">
            Quantity
          </label>
          <div className="inline-flex w-full justify-between rounded-[3px] py-2 px-4 bg-[#242427]">
            <input
              type="number"
              value={quantity}
              placeholder="0"
              onChange={(event) => setQuantity(event.target.value)}
              id="quantity"
              className="bg-transparent p-2 w-full placeholder:text-[#6D6D6D] text-white font-sans-manrope font-semibold text-base leading-6 focus:outline-none"
            />
            <Button
              variant="ghost"
              className="hover:bg-transparent px-0 flex font-sans-manrope h-10 w-fit text-[#6D6D6D] items-center justify-between rounded-md text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <span className="text-nowrap">{selectedToken ?? "Select Token"}</span>
              <BiSolidDownArrow className="h-3 w-3 ml-4" color="#9D9D9D" />
            </Button>
          </div>
        </form>
        {/* Slider Component */}
        <TokenSlider
          value={sliderValue}
          setValue={setSliderValue}
          handler={handleSliderInput}
        />
      </div>
      <div className="flex flex-col gap-2 pt-[14px] pb-6 pl-2 pr-3">
        <button className="bg-[#202832] hover:bg-[#475B72] rounded-[3px] font-sans-manrope font-bold text-[14px] leading-6 text-[#3D85C6] text-center py-[14px] transition-colors duration-200">
          Long
        </button>
        {/* Iterate this data after calculating/fetching */}
        <div className="flex flex-col gap-2">
          <p className="inline-flex items-center justify-between w-full">
            <span className="text-[#6D6D6D]">Fee (0.555)</span>
            <span className="font-normal">0.25%</span>
          </p>
          <p className="inline-flex items-center justify-between w-full">
            <span className="text-[#6D6D6D]">TVL</span>
            <span className="font-normal">0.25%</span>
          </p>
          <p className="inline-flex items-center justify-between w-full">
            <span className="text-[#6D6D6D]">Volume (24h)</span>
            <span className="font-normal">0.25%</span>
          </p>
          <p className="inline-flex items-center justify-between w-full">
            <span className="text-[#6D6D6D]">Conversion Fee</span>
            <span className="font-normal">0.25%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LongTrade;
