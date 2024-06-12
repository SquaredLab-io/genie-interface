import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import TextGradient from "@components/common/TextGradient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";

const Trade = () => {
  const token_price = {
    price: 71148.1,
    updated_price: 71147.6
  };

  const price_day_update = {
    update: 184.2,
    percetage: 0.25
  };

  const selected_token = {
    symbol: "BTCUSDT",
    power: 2,
    type: "USDT Perpetual"
  };

  const [quantity, setQuantity] = useState("");
  const [selectedToken, setSelectedToken] = useState("btc");

  return (
    <div className="flex flex-row gap-1">
      {/* Left Size */}
      <div className="flex-1">
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
              <span className="text-xs leading-4 text-[#ADB1B8]">
                {selected_token.type}
              </span>
            </div>
            <button>
              <Image
                src="/icons/MenuDropIcon.svg"
                width={20}
                height={20}
                alt="menu-icon"
              />
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
                className={clsx(
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
              <span className="font-normal text-xs text-[#71757A]">
                Funding Rate / Countdown
              </span>
              <div>
                <TextGradient className="from-[#0099FF] to-[#00CCFF]">
                  0.0105%
                </TextGradient>
                <span className="px-1">/</span>
                <span>05:29:40</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p>Candlestick Graph</p>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1 max-w-[400px] w-full">
        {/* Long/Short Action Card */}
        <div className="flex flex-col bg-primary-gray">
          <div className="inline-flex items-center font-sans-manrope font-semibold text-base border-b-[0.5px] border-[#303030] w-full">
            <button className="w-1/2 py-[18px] text-center border border-[#0099FF] rounded-r-[3px]">
              <TextGradient className="from-[#0099FF] to-[#00CCFF]">
                Buy/Long
              </TextGradient>
            </button>
            <button className="w-1/2 py-[18px] text-center rounded-l-[3px]">Short</button>
          </div>
          <div className="flex flex-col font-medium text-xs leading-4">
            <div className="flex flex-col gap-2 pt-[14px] pb-2 pl-2 pr-3 border-b border-[#303030]">
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
                <label className="text-[#A5A5A5]">Quantity</label>
                <div className="inline-flex w-full justify-between rounded-[3px] py-2 px-4 bg-[#242427]">
                  <input
                    type="number"
                    value={quantity}
                    placeholder="0"
                    onChange={(event) => setQuantity(event.target.value)}
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
            </div>
            <div className="flex flex-col gap-2 pt-[14px] pb-6 pl-2 pr-3">
              {/* Open Position Button */}
              <button className="bg-[#202832] hover:bg-[#232c38] rounded-[3px] font-sans-manrope font-bold text-[14px] leading-6 text-[#3D85C6] text-center py-[14px] transition-colors duration-200">
                Open Position
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
        </div>
        <div className="bg-primary-gray mt-1 py-4 pr-3 pl-2">
          <h3 className="font-normal text-xs mb-4">Market Data</h3>
          <div className="flex flex-col gap-2">
            <p className="inline-flex items-center justify-between font-medium text-xs leading-4">
              <span className="text-[#6D6D6D]">Price</span>
              <span className="font-normal">$0.482</span>
            </p>
            <p className="inline-flex items-center justify-between font-medium text-xs leading-4">
              <span className="text-[#6D6D6D]">Market Cap</span>
              <span className="font-normal">$482M</span>
            </p>
            <p className="inline-flex items-center justify-between font-medium text-xs leading-4">
              <span className="text-[#6D6D6D]">Volume (24h)</span>
              <span className="font-normal">$291M</span>
            </p>
            <p className="inline-flex items-center justify-between font-medium text-xs leading-4">
              <span className="text-[#6D6D6D]">Day Change</span>
              <span className="font-normal">-0.54%</span>
            </p>
            <p className="inline-flex items-center justify-between font-medium text-xs leading-4">
              <span className="text-[#6D6D6D]">Max Total Supply</span>
              <span className="font-normal">$1.5 billion</span>
            </p>
            <p className="inline-flex items-center justify-between font-medium text-xs leading-4">
              <span className="text-[#6D6D6D]">Available Supply</span>
              <span className="font-normal">$1.5 billion82</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
