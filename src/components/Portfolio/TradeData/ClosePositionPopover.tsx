import { FC, memo, ReactNode, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import DropDownIcon from "@components/icons/DropDownIcon";
import { useTradeStore } from "@store/tradeStore";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import SliderBar from "../Trade/SliderBar";

interface PropsType {
  children: ReactNode;
  longPos: string;
  shortPos: string;
  isLong: boolean;
  onClickTrigger?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const ClosePositionPopover: FC<PropsType> = ({
  children,
  longPos,
  shortPos,
  isLong,
  onClickTrigger,
  isOpen,
  setIsOpen
}) => {
  const [quantity, setQuantity] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number[]>([0]);

  const [isLoading, setIsLoading] = useState(false);

  const { selectedPool } = useTradeStore();
  console.log("selectedPool", selectedPool);

  const { potentia } = usePotentiaSdk();

  /**
   * Handler for closePosition from SDK
   */
  async function closePositionHandlerSdk() {
    const amount = parseFloat(quantity) * 10 ** 18;
    console.log("Amount", amount);
    setIsLoading(true);
    try {
      const txnHash = await potentia?.closePosition(
        selectedPool.poolAddress,
        BigInt(amount).toString(),
        isLong
      );
      console.log("closePosition hash", txnHash);
    } catch (error) {
      console.error("closePosition Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Slider value updater
  useEffect(() => {
    const balance = isLong ? longPos : shortPos;
    if (balance) {
      const amount = (parseFloat(balance) * sliderValue[0]) / 100;
      setQuantity(amount.toString());
    }
  }, [longPos, shortPos, sliderValue]);

  return (
    <Popover open={isOpen} onOpenChange={isLoading ? () => {} : setIsOpen}>
      <PopoverTrigger className="min-w-fit z-50" onClick={onClickTrigger}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="bg-primary-gray border border-secondary-gray rounded-base p-0"
      >
        {/* Title */}
        <h1 className="text-center font-sans-ibm-plex font-medium text-sm/5 mt-[14px] mb-2">
          Close Long Position
        </h1>
        {/* Closing Amount Container - Input, Token */}
        <div className="flex flex-col gap-2 text-left text-xs/4 font-medium text-[#9299AA] py-4 px-2">
          <label htmlFor="quantity">Quantity</label>
          <div className="flex flex-col items-start w-full border-spacing-0 border border-secondary-gray rounded-[4px] py-2 pl-3 pr-4 mb-1">
            <div className="inline-flex justify-between items-center w-full">
              <input
                type="number"
                value={quantity}
                placeholder="0"
                onChange={(event) => setQuantity(event.target.value)}
                id="quantity"
                className="bg-transparent p-2 w-full placeholder:text-[#6D6D6D] text-white font-semibold text-sm/6 focus:outline-none"
              />
              <span className="w-fit text-[#6D6D6D] items-center justify-between rounded-md text-sm">
                {selectedPool.underlyingTokens[0].symbol}
              </span>
            </div>
            <span>Balance: {isLong ? longPos : shortPos}</span>
          </div>
          <SliderBar value={sliderValue} setValue={setSliderValue} min={0} max={100} />
        </div>
        <Separator />
        <div className="flex flex-col gap-2 px-6 py-2 font-normal text-[#9299AA] text-xs/4">
          <p className="inline-flex items-center justify-between w-full">
            <span>Fee (0.555)</span>
            <span className="font-medium text-white">0.25%</span>
          </p>
          <p className="inline-flex items-center justify-between w-full">
            <span>TVL</span>
            <span className="font-medium text-white">0.25%</span>
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-3 p-2">
          <div className="w-full px-4 mt-1 inline-flex items-center justify-between font-medium text-xs/4">
            <span>Payout</span>
            <button className="inline-flex items-center gap-[2px]">
              <span>0 BTC</span>
              <DropDownIcon className="w-3" />
            </button>
          </div>
          {/* CTA -- Close Position */}
          <button
            className="w-full py-2 uppercase text-[#CF1800] bg-[#39150F] hover:bg-[#491a12] font-sans-ibm-plex font-medium text-sm/6 transition-colors"
            onClick={closePositionHandlerSdk}
          >
            {isLoading ? <span>PROCESSING...</span> : <span>CLOSE POSITION</span>}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(ClosePositionPopover);
