import { selected_token } from "../helper";
import { useState } from "react";
import TextGradient from "@components/common/TextGradient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";

enum TradeOptions {
  long = "long",
  short = "short"
}

const Trade = () => {
  const [quantity, setQuantity] = useState("");
  const [selectedToken, setSelectedToken] = useState("btc");

  const LongTrade = () => {
    return (
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
        </div>
        <div className="flex flex-col gap-2 pt-[14px] pb-6 pl-2 pr-3">
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
    );
  };

  const ShortTrade = () => {
    return (
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
        </div>
        <div className="flex flex-col gap-2 pt-[14px] pb-6 pl-2 pr-3">
          <button className="bg-[#202832] hover:bg-[#232c38] rounded-[3px] font-sans-manrope font-bold text-[14px] leading-6 text-[#3D85C6] text-center py-[14px] transition-colors duration-200">
            Close Position
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

  return (
    <>
      <div className="flex flex-col bg-primary-gray">
        <Tabs defaultValue={TradeOptions.long} className="w-full">
          <TabsList className="w-full flex flex-row items-center font-sans-manrope font-semibold text-base border-b-[0.5px] border-[#303030]">
            <TabsTrigger
              value={TradeOptions.long}
              className={cn(
                "w-1/2 py-[18px] text-center rounded-r-[3px]",
                "data-[state=active]:border border-[#0099FF] data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-[#0099FF] data-[state=active]:to-[#00CCFF]"
              )}
            >
              <span className="bg-gradient-to-r text-transparent bg-clip-text from-[#0099FF] to-[#00CCFF]">
                Long
              </span>
            </TabsTrigger>
            <TabsTrigger
              value={TradeOptions.short}
              className={cn(
                "w-1/2 py-[18px] text-center rounded-l-[3px]",
                "data-[state=active]:border border-[#0099FF] data-[state=active]:bg-gradient-to-r data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:from-[#0099FF] data-[state=active]:to-[#00CCFF]"
              )}
            >
              Short
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TradeOptions.long}>
            <LongTrade />
          </TabsContent>
          <TabsContent value={TradeOptions.short}>
            <ShortTrade />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Trade;

/*

      <div className="flex flex-col bg-primary-gray border border-red-500">

        <div className="inline-flex items-center font-sans-manrope font-semibold text-base border-b-[0.5px] border-[#303030] w-full">
          <button className="w-1/2 py-[18px] text-center border border-[#0099FF] rounded-r-[3px]">
            <TextGradient className="from-[#0099FF] to-[#00CCFF]">Long</TextGradient>
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
          </div>
          <div className="flex flex-col gap-2 pt-[14px] pb-6 pl-2 pr-3">
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

 */
