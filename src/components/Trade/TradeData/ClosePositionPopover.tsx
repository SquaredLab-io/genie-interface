import { FC, memo, ReactNode, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import DropDownIcon from "@components/icons/DropDownIcon";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import SliderBar from "../../common/SliderBar";
import { usePoolsStore } from "@store/poolsStore";
import { Address } from "viem";
import toUnits, { getDecimalAdjusted } from "@lib/utils/formatting";
import { cn } from "@lib/utils";
import { useWaitForTransactionReceipt } from "wagmi";
import { CONFIRMATION } from "@lib/constants";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import SpinnerIcon from "@components/icons/SpinnerIcon";
// Notification
import notification from "@components/common/notification";
import { toast } from "sonner";
import { notificationId } from "../helper";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import { PositionTab } from "@squaredlab-io/sdk";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";

interface PropsType {
  children: ReactNode;
  positions: PositionTab | undefined;
  isLong: boolean;
  onClickTrigger?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const ClosePositionPopover: FC<PropsType> = ({
  children,
  positions,
  isLong,
  onClickTrigger,
  isOpen,
  setIsOpen
}) => {
  const [quantity, setQuantity] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number[]>([0]);

  const { close_event } = notificationId;

  const [isHandlerLoading, setIsHandlerLoading] = useState(false);

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { selectedPool } = usePoolsStore();
  // console.log("selectedPool", selectedPool);

  const { potentia } = usePotentiaSdk();

  const longTokenBalance = getDecimalAdjusted(positions?.longPositionTab?.tokenSize, 18);
  const shortTokenBalance = getDecimalAdjusted(
    positions?.shortPositionTab?.tokenSize,
    18
  );

  // Current user balance of Long / Short Token
  const balance = isLong ? longTokenBalance : shortTokenBalance;

  // const { refetch: refetchTxHistory } = useTxHistory(true);
  const { refetch: refetchTxHistory } = useTradeHistory(true);

  // All current positions
  const { refetch: refetchOpenOrders } = useOpenOrders({
    poolAddress: selectedPool()?.poolAddr as Address,
    paused: true
  });

  // TODO: Update the user-balance too

  /**
   * Handler for closePosition from SDK
   */
  async function closePositionHandlerSdk() {
    const amount = parseFloat(quantity) * 10 ** 18;
    // const amount = value * 10 ** 18;
    console.log("Amount", amount);
    setIsHandlerLoading(true);
    try {
      const hash = await potentia?.poolWrite.closePosition(
        selectedPool()?.poolAddr! as Address,
        BigInt(amount).toString(),
        isLong
      );
      setTxHash(hash as Address);
      setIsHandlerLoading(false);
      // console.log("closePosition hash", hash);
    } catch (error) {
      notification.error({
        id: close_event.default,
        title: "Attempt to Close Position failed",
        description: "Please try again"
      });
      setIsHandlerLoading(false);
      console.error("closePosition Error", error);
    } finally {
      setIsHandlerLoading(false);
    }
  }

  // wait for openPosition transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  // Notifications based on Transaction status
  useEffect(() => {
    if (isLoading) {
      notification.loading({
        id: close_event.loading,
        title: "Closing position in process..."
      });
    } else if (isError) {
      toast.dismiss(close_event.loading);
      notification.error({
        id: close_event.error,
        title: "Closing position failed",
        description: `${error.message}`
      });
    }
  }, [isError, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      refetchOpenOrders();
      refetchTxHistory();
      // TODO: refetchBalance();
      
      toast.dismiss(close_event.loading);
      notification.success({
        id: close_event.success,
        title: "Position successfully closed"
      });
    }
  }, [isSuccess]);

  // Slider value updater
  useEffect(() => {
    if (balance) {
      const amount = (balance * sliderValue[0]) / 100;
      setQuantity(amount.toString());
    }
  }, [balance, sliderValue]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={isHandlerLoading ? () => {} : setIsOpen}
      modal={true}
      defaultOpen={false}
    >
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
              <p className="inline-flex items-center gap-[2px]">
                <span className="w-fit text-[#6D6D6D] items-center justify-between rounded-md text-sm">
                  {selectedPool()?.underlying}
                  <sup>2</sup>
                </span>
                <span className="opacity-60">{isLong ? "L" : "S"}</span>
              </p>
            </div>
            <span>
              Balance: {toUnits(isLong ? longTokenBalance : shortTokenBalance, 3)}
            </span>
          </div>
          <SliderBar
            value={sliderValue}
            setValue={setSliderValue}
            min={0}
            max={100}
            indices={[0, 25, 50, 75, 100]}
            isPerc={true}
          />
        </div>
        <Separator />
        {/* <div className="flex flex-col gap-2 px-6 py-2 font-normal text-[#9299AA] text-xs/4">
          <p className="inline-flex items-center justify-between w-full">
            <span>Fee (0.555)</span>
            <span className="font-medium text-white">0.25%</span>
          </p>
          <p className="inline-flex items-center justify-between w-full">
            <span>TVL</span>
            <span className="font-medium text-white">0.25%</span>
          </p>
        </div>
        <Separator /> */}
        <div className="flex flex-col gap-3 p-2">
          <div className="w-full px-4 mt-1 inline-flex items-center justify-between font-medium text-xs/4">
            <span>Payout</span>
            <p className="inline-flex items-center gap-[2px]">
              <span>0 {selectedPool()?.underlying}</span>
              <DropDownIcon className="w-3" />
            </p>
          </div>
          {/* CTA -- Close Position */}
          <button
            className={cn(
              "w-full py-2 uppercase text-[#CF1800] bg-[#39150F] hover:bg-[#491a12] font-sans-ibm-plex font-medium text-sm/6 transition-colors",
              "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
            )}
            onClick={closePositionHandlerSdk}
            disabled={
              !isValidPositiveNumber(quantity) ||
              isHandlerLoading ||
              !balance ||
              !selectedPool() ||
              isHandlerLoading ||
              isLoading
            }
          >
            {(isHandlerLoading || isLoading) && !isError ? (
              <SpinnerIcon className="size-[16px] mx-auto" />
            ) : (
              <span>CLOSE POSITION</span>
            )}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(ClosePositionPopover);
