"use client";

// Library Imports
import { FC, memo, useEffect, useMemo, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { type PotentiaSdk } from "@squaredlab-io/sdk/src";
import { z } from "zod";
import { Address } from "viem";
// Component, Util Imports
import SliderBar from "../../common/SliderBar";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import { WethABi } from "@lib/abis";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";
import notification from "@components/common/notification";
import TradeInfo from "./TradeInfo";
import toUnits from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import { usePoolsStore } from "@store/poolsStore";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";

interface PropsType {
  potentia?: PotentiaSdk;
}

const LongTrade: FC<PropsType> = ({ potentia }) => {
  const [quantity, setQuantity] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number[]>([25]);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  useEffect(() => console.log("LongTrade component re-rendering"), []);

  const { selectedPool } = usePoolsStore();

  // Contract Hooks
  const { address, isConnected } = useAccount();

  const {
    data: userBalance,
    isLoading: isBalLoading,
    refetch: refetchBalance
  } = useBalance({
    address,
    token: selectedPool()?.underlyingAddress! as Address
  });

  // Both hooks paused, Refetch method to be used on Successful tx
  const {
    openOrders: positionData,
    isFetching: isPositionFetching,
    refetch: refetchOpenOrders
  } = useOpenOrders({
    poolAddress: selectedPool()?.poolAddr! as Address
  });

  const longPosition = positionData?.longPositionTab?.tokenSize;

  // getting underlying token's price
  const { price, isFetching: isPriceFetching } = useCurrencyPrice(
    selectedPool()?.underlying
  );

  // const { refetch: refetchTxHistory } = useTxHistory(true);
  const { refetch: refetchTxHistory } = useTradeHistory(true);

  // Write Hook => Token Approval
  const {
    data: approvalData,
    writeContractAsync: writeApproveToken,
    error: approveError,
    isPending: isApprovePending
  } = useWriteContract();

  /**
   * This handler method approves signers WETH_ADDR tokens to be spent on Potentia Protocol
   */
  const approveHandler = async () => {
    const _amount = parseFloat(quantity) * 10 ** 18;
    try {
      await writeApproveToken({
        abi: WethABi,
        address: selectedPool()?.underlyingAddress! as Address,
        functionName: "approve",
        args: [
          selectedPool()?.poolAddr,
          BigInt(_amount).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      notification.error({
        title: "Token approval failed!",
        description: `${approveError?.message}`
      });
      console.log("Token approval failed", error);
    }
  };

  // wait for approval transaction
  const {
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    isError: isApproveError,
    error: approvalError
  } = useWaitForTransactionReceipt({
    hash: approvalData,
    confirmations: CONFIRMATION
  });

  // wait for openPosition transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  /**
   * Handler for Opening Long Position
   */
  const openLongPositionHandler = async () => {
    const _amount = parseFloat(quantity) * 10 ** 18;
    try {
      const hash = await potentia?.poolWrite.openPosition(
        selectedPool()?.poolAddr!, // poolAddress
        BigInt(_amount).toString(), // amt
        true // isLong
      );
      // set txHash in a state
      if (hash) {
        setTxHash(hash as `0x${string}`);
      }
    } catch (e) {
      console.error("Error: Opening long position failed!");
    }
  };

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

  // Slider value updater
  useEffect(() => {
    if (userBalance?.value) {
      const amount = (parseFloat(userBalance?.formatted) * sliderValue[0]) / 100;
      setQuantity(amount.toString());
    }
  }, [userBalance, sliderValue]);

  // Executes if Approve Successful
  useEffect(() => {
    if (isApproveSuccess) {
      console.log(`Token is approved for ${quantity}`);
      openLongPositionHandler();
      notification.success({
        title: "Token Approved",
        description: "You may now process to Opening a long position"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess]);

  // Notifications based on Transaction status
  useEffect(() => {
    if (isApproveError) {
      notification.error({
        title: "Approval failed",
        description: `${approvalError.message}`
      });
    } else if (isError) {
      notification.error({
        title: "Opening Long Position failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      refetchBalance();
      // refetchPosition();
      refetchOpenOrders();
      refetchTxHistory();
      notification.success({
        title: "Long position successfully opened!"
        // description: "Balance, Position, OpenOrders and txHistory must be updating."
      });
    }
  }, [isSuccess, isError, isApproveError]);

  return (
    <div className="flex flex-col font-normal text-xs/[14px] gap-2 py-6 px-4">
      <p className="inline-flex items-start gap-1 w-full">
        <span className="text-[#757B80]">Balance:</span>
        <span className="font-medium">
          {getAccountBalance(userBalance, isBalLoading)}
        </span>
      </p>
      <p className="inline-flex items-start gap-1 w-full">
        <span className="text-[#757B80]">Current Position:</span>
        {isPositionFetching && !positionData ? (
          <span>...</span>
        ) : (
          <span className="font-medium">
            {toUnits(parseFloat(longPosition ?? "0") / 10 ** 18, 3)}
          </span>
        )}
      </p>
      <form
        className="flex flex-col w-full gap-2 mt-5"
        autoComplete="off"
        autoCapitalize="off"
        name="token-quantity"
      >
        <label htmlFor="quantity" className="text-[#757B80]">
          Size:
        </label>
        {/* Input Box: Token Input and Selection */}
        <div
          className={cn(
            "inline-flex w-full justify-between items-center border py-2 px-3 bg-transparent",
            balanceExceedError ? "border-[#FF615C]" : "border-[#1F2D3F]"
          )}
        >
          <div className="flex flex-col gap-1 items-start w-full max-w-full">
            <input
              type="number"
              value={quantity}
              placeholder={`Qty (min) is 0.001 ${selectedPool()?.underlying}`}
              onChange={(event) => setQuantity(event.target.value)}
              id="quantity"
              className="bg-transparent py-2 w-full placeholder:text-[#6D6D6D] text-white font-noemal text-sm/4 focus:outline-none"
            />
            <span className="text-[#404950]">
              {isPriceFetching && !price && !isValidPositiveNumber(quantity)
                ? "..."
                : `$${price * parseFloat(quantity !== "" ? quantity : "0")}`}
            </span>
          </div>
          <TokenSelectPopover size="compact">
            <button className="hover:bg-transparent px-0 flex h-10 items-center justify-between gap-0 font-normal text-sm/4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
              <span className="text-nowrap">{selectedPool()?.underlying}</span>
              <BiSolidDownArrow className="h-3 w-3 ml-4" color="#9D9D9D" />
            </button>
          </TokenSelectPopover>
        </div>
        {balanceExceedError && (
          <p className="font-normal text-xs/[14px] text-[#FF615C]">Insufficient Funds</p>
        )}
      </form>
      {/* Slider Component */}
      <div className="w-full my-4">
        <SliderBar
          value={sliderValue}
          setValue={setSliderValue}
          min={0}
          max={100}
          indices={[0, 25, 50, 75, 100]}
          isPerc={true}
        />
      </div>
      {/* CTA: OPEN LONG TRADE BUTTON */}
      <ButtonCTA
        disabled={
          !isConnected ||
          !userBalance ||
          isApproveLoading ||
          isApprovePending ||
          isLoading ||
          (isApproveSuccess && isPending) ||
          balanceExceedError ||
          !minQuantityCheck
        } // conditions to Long Button
        onClick={() => approveHandler()}
        isLoading={isApproveLoading || isLoading}
      >
        <span>OPEN</span>
      </ButtonCTA>
      {/* Iterate this data after calculating/fetching */}
      <TradeInfo />
    </div>
  );
};

export default memo(LongTrade);
