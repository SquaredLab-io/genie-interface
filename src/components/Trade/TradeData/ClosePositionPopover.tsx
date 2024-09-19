// Library Imports
import {
  ChangeEvent,
  FC,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Address } from "viem";
import { toast } from "sonner";
import BigNumber from "bignumber.js";
import { useWaitForTransactionReceipt } from "wagmi";
import { OpenPositionInfo } from "@squaredlab-io/sdk";
// Component Imports
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import DropDownIcon from "@components/icons/DropDownIcon";
import SliderBar from "@components/common/slider-bar";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import notification from "@components/common/notification";
import { usePoolsStore } from "@store/poolsStore";
import { cn } from "@lib/utils";
// Hook and Util Imports
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import {
  _getDecimalAdjusted,
  formatNumber,
  getDecimalAdjusted,
  getDecimalDeadjusted
} from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { notificationId } from "../helper";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import useUnderlyingEstimateOut from "@lib/hooks/useUnderlyingEstimateOut";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePopover } from "./PopoverContext";

interface PropsType {
  children: ReactNode;
  position: OpenPositionInfo;
  isLong: boolean;
  popoverId: string;
  // onClickTrigger?: () => void;
  // isOpen?: boolean;
  // setIsOpen?: (open: boolean) => void;
}

const ClosePositionPopover: FC<PropsType> = memo(
  ({ children, position, isLong, popoverId }) => {
    const { openPopoverId, setOpenPopoverId } = usePopover();
    const isOpen = openPopoverId === popoverId;

    const quantityRef = useRef(position.tokenSize);
    const inputAmountRef = useRef("");
    const sliderValueRef = useRef(0);

    const [quantity, setQuantity] = useState<string>(quantityRef.current);
    const [inputAmount, setInputAmount] = useState<string>(inputAmountRef.current);
    const [sliderValue, setSliderValue] = useState<number>(sliderValueRef.current);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
    const [isHandlerLoading, setIsHandlerLoading] = useState(false);

    const { potentia } = usePotentiaSdk();

    const { selectedPool, poolsToPower } = usePoolsStore();
    const { close_event } = notificationId;

    const balance = new BigNumber(position?.tokenSize ?? "0");

    const isValidQuantity = !isNaN(parseFloat(quantity));

    // All current positions
    const { refetch: refetchOpenOrders } = useOpenOrders({
      poolAddress: selectedPool()?.poolAddr as Address,
      paused: true
    });
    // Closed orders History
    const { refetch: refetchTxHistory } = useTxHistory(true);

    // Get the Estimate Underlying Output
    const { output, isFetching: isOutputFetching } = useUnderlyingEstimateOut({
      poolAddress: selectedPool()?.poolAddr as Address,
      amount: quantity,
      isLong
    });

    const { refetch: refetchBalance } = useTokenBalance({
      token: selectedPool()?.underlyingAddress! as Address,
      decimals: selectedPool()?.underlyingDecimals!,
      symbol: selectedPool()?.underlying!
    });

    /**
     * Handler for closePosition from SDK
     */
    async function closePositionHandlerSdk() {
      const amount = getDecimalDeadjusted(quantity, 18);
      // const amount = BigInt(quantity).toString();
      setIsHandlerLoading(true);
      notification.loading({
        id: close_event.loading_init,
        title: "Closing Position initiated..."
      });
      try {
        const hash = await potentia?.poolWrite.closePosition(
          position?.pool!,
          amount,
          isLong
        );
        setTxHash(hash as Address);

        // dismissing loading status and toast
        toast.dismiss(close_event.loading_init);
        setIsHandlerLoading(false);
      } catch (error) {
        // dismiss loading toast onError
        toast.dismiss(close_event.loading_init);
        notification.error({
          id: close_event.default,
          title: "Attempt to Close Position failed",
          description: "Please try again",
          duration: 5000
        });
        setIsHandlerLoading(false);
        console.error("closePosition Error", error);
      } finally {
        toast.dismiss(close_event.loading_init);
        setIsHandlerLoading(false);
      }
    }

    // Memoized function to handle transaction status updates and notifications
    const handleTransactionStatus = useCallback(
      (status: "loading" | "success" | "error", errorMessage?: string) => {
        switch (status) {
          case "loading":
            notification.loading({
              id: close_event.loading,
              title: "Closing position in process..."
            });
            break;
          case "success":
            toast.dismiss(close_event.loading);
            notification.success({
              id: close_event.success,
              title: "Position successfully closed"
            });
            refetchOpenOrders();
            refetchTxHistory();
            refetchBalance();
            break;
          case "error":
            toast.dismiss(close_event.loading);
            notification.error({
              id: close_event.error,
              title: "Closing position failed",
              description: errorMessage || "An error occurred",
              duration: 5000
            });
            break;
        }
      },
      [refetchOpenOrders, refetchTxHistory, refetchBalance]
    );

    // wait for closePosition transaction
    const { isSuccess, isLoading, isPending, isError, error, status } =
      useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: CONFIRMATION
      });

    useEffect(() => {
      if (isLoading && isPending) {
        handleTransactionStatus("loading");
      } else if (status === "success") {
        handleTransactionStatus("success");
      } else if (status === "error") {
        handleTransactionStatus("error", error?.message);
      }
    }, [status, isLoading, isPending, error, handleTransactionStatus]);

    // Update refs when state changes
    useEffect(() => {
      quantityRef.current = quantity;
      inputAmountRef.current = inputAmount;
      sliderValueRef.current = sliderValue;
    }, [quantity, inputAmount, sliderValue]);

    // Reset state when position changes
    useEffect(() => {
      if (position.tokenSize !== quantityRef.current) {
        setQuantity(position.tokenSize);
        setInputAmount("");
        setSliderValue(0);
      }
    }, [position.tokenSize]);

    // Handler that updates Quantity and keep SliderValue in sync
    function inputHandler(event: ChangeEvent<HTMLInputElement>) {
      const input = event.target.value;
      setQuantity(input);
      setInputAmount(input);
      if (balance) {
        const value = isValidQuantity
          ? (parseFloat(input) / getDecimalAdjusted(balance.toFixed(0), 18)) * 100
          : 0;
        setSliderValue(value);
      }
    }

    // Handler that updates SliderValue and keep Quantity in sync
    function sliderHandler(value: number) {
      setSliderValue(value);
      if (balance) {
        const amount = _getDecimalAdjusted(
          balance.multipliedBy(BigNumber(value)).dividedBy(BigNumber(100)).toFixed(0),
          18
        );
        setQuantity(amount);
        setInputAmount(parseFloat(amount).toFixed(2));
      }
    }

    const isPopoverClosingDisabled = isHandlerLoading || isLoading;

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (open) {
          setOpenPopoverId(popoverId);
        } else {
          setOpenPopoverId(null);
        }
      },
      [popoverId, setOpenPopoverId]
    );

    return (
      <Popover
        open={isOpen}
        // open={isPopoverClosingDisabled ? true : isOpen}
        onOpenChange={handleOpenChange}
        modal={true}
        // defaultOpen={false}
      >
        <PopoverTrigger asChild className="min-w-fit z-50">{children}</PopoverTrigger>
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
                  value={inputAmount}
                  placeholder="0"
                  onChange={inputHandler}
                  id="quantity"
                  className="bg-transparent p-2 w-full placeholder:text-[#6D6D6D] text-white font-semibold text-sm/6 focus:outline-none"
                />
                <p className="inline-flex items-center gap-[2px]">
                  <span className="w-fit text-[#6D6D6D] items-center justify-between rounded-md text-sm">
                    {selectedPool()?.underlying}
                    <sup>{poolsToPower?.[position.pool]}</sup>
                  </span>
                  <span className="opacity-60">{isLong ? "L" : "S"}</span>
                </p>
              </div>
              <span>
                Balance:{" "}
                {formatNumber(
                  getDecimalAdjusted(
                    balance.toFixed(0),
                    // isLong ? longTokenBalance.toFixed(0) : shortTokenBalance.toFixed(0),
                    // isLong ? longTokenBalance.toFixed(0) : shortTokenBalance.toFixed(0),
                    18
                  )
                )}
              </span>
            </div>
            <SliderBar
              value={sliderValue}
              setValue={sliderHandler}
              min={0}
              max={100}
              indices={[0, 25, 50, 75, 100]}
              isPerc={true}
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-3 p-2">
            <div className="w-full px-4 mt-1 inline-flex items-center justify-between font-medium text-xs/4">
              <span>Payout</span>
              <p className="inline-flex items-center gap-[2px]">
                <span>
                  {isOutputFetching
                    ? "..."
                    : isValidQuantity
                      ? formatNumber(
                          getDecimalAdjusted(output, selectedPool()?.underlyingDecimals)
                        )
                      : "N/A"}{" "}
                  {selectedPool()?.underlying}
                </span>
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
                isPopoverClosingDisabled ||
                !balance ||
                !selectedPool()
              }
            >
              {isPopoverClosingDisabled && !isError ? (
                <SpinnerIcon className="size-[16px] mx-auto" />
              ) : (
                <span>CLOSE POSITION</span>
              )}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

ClosePositionPopover.displayName = "ClosePositionPopover";

export default memo(ClosePositionPopover);
