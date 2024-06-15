import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";
import { useState } from "react";
import { selected_token } from "../helper";
import { Slider } from "@components/ui/slider";
import { cn } from "@lib/utils";

const LongTrade = () => {
  const [quantity, setQuantity] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("btc");
  const [sliderValue, setSliderValue] = useState<number[]>([25]);

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
            <Select
              onValueChange={(e) => console.log("value change", e)}
              defaultValue={selectedToken}
            >
              <SelectTrigger className="max-w-fit rounded-sm bg-transparent">
                <SelectValue placeholder={<span>Select Token</span>} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usdt">USDT</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
                <SelectItem value="eth">ETH</SelectItem>
                <SelectItem value="sol">SOL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <div className="mt-1 w-full inline-flex gap-4">
          <Slider
            defaultValue={sliderValue}
            value={sliderValue[0] ? sliderValue : [0]}
            max={100}
            step={1}
            onValueChange={(e) => setSliderValue(e)}
          />
          <div className="relative max-w-16">
            <input
              type="number"
              value={sliderValue[0]}
              placeholder={"0"}
              onChange={(event) => {
                setSliderValue([parseFloat(event.target.value)]);
              }}
              id="quantity"
              className="py-0 pl-5 pr-7 w-full rounded-base bg-[#242427] placeholder:text-[#6D6D6D] text-white font-sans-manrope font-normal text-xs leading-[31px] focus:outline-none ring-1 ring-[#2F2F2F]"
            />
            <span className={cn("absolute", sliderValue[0] > 0 && "")}>%</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-[14px] pb-6 pl-2 pr-3">
        <button className="bg-[#202832] hover:bg-[#232c38] rounded-[3px] font-sans-manrope font-bold text-[14px] leading-6 text-[#3D85C6] text-center py-[14px] transition-colors duration-200">
          Long
        </button>
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
