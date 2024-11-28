// Library Imports
import { FC, ChangeEvent, useCallback, useEffect, useMemo, useState, memo } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import { type PotentiaSdk } from "@squaredlab-io/sdk/src";
import { z } from "zod";
import BigNumber from "bignumber.js";
// Component Imports
import SliderBar from "@components/common/slider-bar";
import { Separator } from "@components/ui/separator";
import ButtonCTA from "@components/common/button-cta";
import TradeInfo, { Marker } from "../TradeSection/TradeInfo";
import MarketData from "../MarketData";
// Util Imports
import { usePoolsStore } from "@store/poolsStore";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import usePTokenEstimateOut from "@lib/hooks/usePTokenEstimateOut";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import useIsApprovedToken from "@lib/hooks/useIsApprovedToken";
import useApproveToken from "@lib/hooks/useApproveToken";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";
import {
  _getDecimalAdjusted,
  formatNumber,
  getDecimalAdjusted,
  getDecimalDeadjusted
} from "@lib/utils/formatting";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { CONFIRMATION } from "@lib/constants";
import { cn } from "@lib/utils";
import { WethABi } from "@lib/abis";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import {
  TransactionError,
  TransactionLoading,
  TransactionSuccess
} from "./transaction-interfaces";

interface PropsType {
  potentia?: PotentiaSdk;
}

const ShortTradeDrawer: FC<PropsType> = ({ potentia }) => {
  const [quantity, setQuantity] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(25);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isHandlerLoading, setIsHandlerLoading] = useState(false);

  const { selectedPool } = usePoolsStore();
  // const { short_event } = notificationId;

  // Contract Hooks
  const { isConnected, address } = useAccount();

  const {
    data: userBalance,
    isFetching: isBalLoading,
    refetch: refetchBalance
  } = useTokenBalance({
    token: selectedPool()?.underlyingAddress as Address,
    decimals: selectedPool()?.underlyingDecimals!,
    symbol: selectedPool()?.underlying!
  });
  const balance = userBalance?.value;

  // Both hooks paused, Refetch method to be used on Successful tx
  const {
    openOrders: positionData,
    isFetching: isPositionFetching,
    refetch: refetchOpenOrders
  } = useOpenOrders({
    paused: true
  });
  // Current Short Position tokensize
  const shortPosition = positionData?.shortPositions.find(
    (pos) => pos.pool == selectedPool()?.poolAddr
  )?.tokenSize;

  const { output, isFetching: isOutputFetching } = usePTokenEstimateOut({
    poolAddress: selectedPool()?.poolAddr as Address,
    amount: getDecimalDeadjusted(quantity, selectedPool()?.underlyingDecimals),
    isLong: false
  });

  const { refetch: refetchTradeHistory } = useTradeHistory(true);
  const { refetch: refetchUserPoints } = useUserPoints({ address });

  const {
    isApprovedData,
    isApprovedLoading,
    isApprovedSuccess,
    refetch: refetchIsApproved
  } = useIsApprovedToken({
    tokenAddress: selectedPool()?.underlyingAddress as Address,
    poolAddress: selectedPool()?.poolAddr as Address,
    tokenBalance: userBalance,
    input: parseFloat(quantity ?? "0")
  });

  const { isApproveLoading, writeApproveToken } = useApproveToken();

  const { isSuccess, isLoading, isPending, isError } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: CONFIRMATION
  });

  const approveHandler = useCallback(async () => {
    if (!selectedPool()) return;
    const _quantity = getDecimalDeadjusted(quantity, selectedPool()?.underlyingDecimals);

    try {
      await writeApproveToken({
        abi: WethABi,
        address: selectedPool()?.underlyingAddress! as Address,
        functionName: "approve",
        args: [selectedPool()?.poolAddr! as Address, BigInt(_quantity).toString()]
      });
    } catch (error) {
      console.error("Token Approval Failed while approving.");
      //   notification.error({
      //     id: short_event.default_approve,
      //     title: "Token Approval Failed",
      //     description: "Unable to initiate token approval."
      //   });
    }
  }, [quantity, selectedPool(), writeApproveToken]);

  const openShortPositionHandler = useCallback(async () => {
    const _amount = getDecimalDeadjusted(quantity, selectedPool()?.underlyingDecimals);
    setIsHandlerLoading(true);

    try {
      const hash = await potentia?.poolWrite.openPosition(
        selectedPool()?.poolAddr as Address,
        BigInt(_amount).toString(),
        false
      );
      setTxHash(hash as `0x${string}`);
    } catch (error) {
      console.log("Open short position failed:\n", error);
      // notification.error({
      //   id: short_event.default,
      //   title: "Open Position Failed",
      //   description: "Unable to open position. Please try again."
      // });
    } finally {
      setIsHandlerLoading(false);
    }
  }, [quantity, potentia, selectedPool()]);

  const inputHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      setQuantity(input);
      setInputAmount(input);
      if (userBalance) {
        const value = isValidPositiveNumber(input)
          ? (parseFloat(input) /
              getDecimalAdjusted(balance?.toFixed(0), userBalance.decimals)) *
            100
          : 0;
        setSliderValue(value);
      }
    },
    [userBalance, balance]
  );

  const sliderHandler = useCallback(
    (value: number) => {
      setSliderValue(value);
      if (userBalance) {
        const amount = _getDecimalAdjusted(
          balance?.multipliedBy(BigNumber(value)).dividedBy(BigNumber(100)).toFixed(0),
          userBalance.decimals
        );
        setQuantity(amount);
        setInputAmount(parseFloat(amount).toFixed(2));
      }
    },
    [userBalance, balance]
  );

  const balanceExceedError = useMemo(
    () =>
      !!userBalance &&
      z.number().gt(parseFloat(userBalance?.formatted)).safeParse(parseFloat(quantity))
        .success,
    [userBalance, quantity]
  );

  const minQuantityCheck = useMemo(() => {
    return z.number().min(0.001).safeParse(parseFloat(quantity)).success;
  }, [quantity]);

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchOpenOrders();
      refetchTradeHistory();
      refetchIsApproved();
      refetchUserPoints();
    }
  }, [isSuccess]);

  return isLoading && isPending ? (
    <TransactionLoading title="Opening Short Position" />
  ) : isError ? (
    <TransactionError />
  ) : isSuccess ? (
    <TransactionSuccess />
  ) : (
    <>
      <div className="w-full py-5 px-3">
        <div className="flex flex-col items-start gap-y-2">
          <div className="flex flex-col gap-y-2 text-left text-xs/[14px] font-normal">
            <p className="inline-flex items-start gap-1 w-full">
              <span className="text-[#757B80]">Balance:</span>
              <span className="font-medium">
                {getAccountBalance(userBalance, isBalLoading)}
              </span>
            </p>
            <div className="inline-flex items-start gap-1 w-full">
              <span className="text-[#757B80]">Current Position:</span>
              {isPositionFetching && !positionData ? (
                <span>...</span>
              ) : (
                <span className="font-medium">
                  {formatNumber(
                    getDecimalAdjusted(shortPosition, selectedPool()?.underlyingDecimals)
                  )}
                </span>
              )}
            </div>
          </div>
          <label
            className="font-normal text-xs/[14px] text-[#757B80] mt-3"
            htmlFor="quantity"
          >
            Size
          </label>
          <div
            className={cn(
              "flex flex-col items-start w-full border-spacing-0 rounded-[4px] p-3 mb-1 border",
              balanceExceedError ? "border-error-red" : "border-secondary-gray"
            )}
          >
            <div className="inline-flex justify-between items-center w-full text-base/5 font-normal">
              <input
                type="number"
                value={inputAmount}
                placeholder="0"
                onChange={inputHandler}
                id="quantity"
                className="bg-transparent p-2 w-full placeholder:text-[#6D6D6D] text-white focus:outline-none"
              />
              <p className="inline-flex items-center gap-[2px]">
                <span className="w-fit items-center justify-between rounded-md">
                  {selectedPool()?.underlying}
                  <sup>{selectedPool()?.power}</sup>
                </span>
              </p>
            </div>
          </div>
          <SliderBar
            value={sliderValue}
            setValue={sliderHandler}
            min={0}
            max={100}
            indices={[0, 25, 50, 75, 100]}
            isPerc={true}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <ButtonCTA
            onClick={() =>
              isApprovedSuccess ? openShortPositionHandler() : approveHandler()
            }
            disabled={
              !isConnected ||
              !userBalance ||
              !output ||
              isHandlerLoading ||
              isLoading ||
              isOutputFetching ||
              balanceExceedError ||
              !minQuantityCheck
            }
            isLoading={
              isApproveLoading || isApprovedLoading || isLoading || isOutputFetching
            }
          >
            <span>OPEN</span>
          </ButtonCTA>
          <Marker
            label="Estimated Payout"
            value={`${
              isOutputFetching
                ? "..."
                : !isNaN(parseFloat(quantity)) && isConnected
                  ? formatNumber(getDecimalAdjusted(output, 18))
                  : "N/A"
            } ${selectedPool()?.underlying}`}
            className="text-xs/[14px]"
          />
        </div>
        <TradeInfo />
      </div>
      <Separator />
      <MarketData />
    </>
  );
};

export default memo(ShortTradeDrawer);
