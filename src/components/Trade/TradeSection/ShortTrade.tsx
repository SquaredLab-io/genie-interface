"use client";

// Library Imports
import { FC, memo, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { BiSolidDownArrow } from "react-icons/bi";
import { type PotentiaSdk } from "@squaredlab-io/sdk/src";
// Component, Util Imports
import {} from "../TradeChart/defaultWidgetProps";
import SliderBar from "../../common/SliderBar";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import { WethABi } from "@lib/abis";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { PositionType } from "@lib/types/enums";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import TradeInfo from "./TradeInfo";
import notification from "@components/common/notification";
import toUnits from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import { usePoolsStore } from "@store/poolsStore";
import { Address } from "viem";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import { useBalanceStore } from "@store/tradeStore";

interface PropsType {
  potentia?: PotentiaSdk;
}

const ShortTrade: FC<PropsType> = ({ potentia }) => {
  const { selectedPool } = usePoolsStore((state) => state);

  const [quantity, setQuantity] = useState("");
  const [sliderValue, setSliderValue] = useState<number[]>([25]);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  // Contract Hooks
  const { address, isConnected } = useAccount();
  const {
    data: userBalance,
    isLoading: isBalLoading,
    refetch: refetchBalance
  } = useBalance({
    address,
    token: selectedPool()?.underlyingAddress as Address
  });

  // const {
  //   data: positionData,
  //   isFetching: isPositionFetching,
  //   refetch: refetchPosition
  // } = useCurrentPosition(selectedPool()?.poolAddr as Address);

  // All current positions
  const { refetch: refetchPosition } = useCurrentPosition({
    poolAddress: selectedPool()?.poolAddr as Address
  });

  const { currentPosition: positionData, isFetchingPosition: isPositionFetching } =
    useBalanceStore();

  // Write Hook => Token Approval
  const {
    data: approvalData,
    writeContractAsync: writeApproveToken,
    error: approveError,
    isPending: isApprovePending
  } = useWriteContract();

  // Both hooks paused, Refetch method to be used on Successful tx
  const { refetch: refetchOpenOrders } = useOpenOrders({
    poolAddress: selectedPool()?.poolAddr!,
    paused: true
  });

  const { refetch: refetchTxHistory } = useTxHistory(true);

  /**
   * This handler method approves signers TOKEN_ADDR tokens to be spent on Potentia Protocol
   */
  const approveHandler = async () => {
    const _amount = parseFloat(quantity) * 10 ** 18;
    try {
      await writeApproveToken({
        abi: WethABi,
        address: selectedPool()?.underlyingAddress! as Address,
        functionName: "approve",
        args: [
          selectedPool()?.poolAddr! as Address,
          BigInt(_amount).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      notification.error({
        title: "Approval failed",
        description: `${error}`
      });
      console.log("error while approving", approveError);
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

  // wait for open short position transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  /**
   * Handler for Opening Short Position
   */
  const openShortPositionHandler = async () => {
    const _amount = parseFloat(quantity) * 10 ** 18;
    try {
      const hash = await potentia?.poolWrite.openPosition(
        selectedPool()?.poolAddr as Address, // poolAddress
        BigInt(_amount).toString(), // amt
        false // isLong
      );
      // set txHash in a state
      if (hash) {
        setTxHash(hash as `0x${string}`);
        console.log("txnHash", hash);
      }
    } catch (e) {
      // notification.error({
      //   title: "Opening Short position failed",
      //   description: `${error?.message}`
      // });
      console.log("Opening Short position failed", error);
    } finally {
      console.log("open_short_position amount", _amount);
    }
  };

  const balanceExceedError = useMemo(
    () =>
      !!userBalance?.value && parseFloat(quantity) > parseFloat(userBalance?.formatted),
    [userBalance, quantity]
  );

  useEffect(() => {
    // Executes if Approve Successful
    console.log("approve txn final status", isApproveSuccess);
    if (isApproveSuccess) {
      console.log("Token is approved for the selected amount!");
      openShortPositionHandler();
      notification.success({
        title: "Token Approved",
        description: "You may now process to Opening a short position"
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
        title: "Opening short position failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      refetchBalance();
      refetchPosition();
      refetchOpenOrders();
      refetchTxHistory();
      notification.success({
        title: "Long position successfully opened!"
      });
    }
  }, [isSuccess, isError, isApproveError]);

  // Slider value updater
  useEffect(() => {
    if (userBalance?.value) {
      const amount = (parseFloat(userBalance?.formatted) * sliderValue[0]) / 100;
      setQuantity(amount.toString());
    }
  }, [userBalance, sliderValue]);

  return (
    <div className="flex flex-col font-normal text-xs/[14px] gap-2 pt-4 pb-6 px-4">
      <p className="inline-flex items-start gap-1 w-full">
        <span className="text-[#757B80]">Balance:</span>
        <span className="font-medium">
          {getAccountBalance(userBalance, isBalLoading)}{" "}
        </span>
      </p>
      <p className="inline-flex items-start gap-1 w-full">
        <span className="text-[#757B80]">Current Position:</span>
        {isPositionFetching ? (
          <span>Fetching...</span>
        ) : (
          <span className="font-medium">
            {toUnits(parseFloat(positionData?.shortToken?.balance ?? "0") / 10 ** 18, 4)}
          </span>
        )}
      </p>
      <form
        className="flex flex-col w-full gap-2 mt-3"
        autoComplete="off"
        autoCapitalize="off"
        name="token-quantity"
      >
        <p className="inline-flex items-start gap-1 w-full">
          <span className="text-[#757B80]">Available:</span>
          <span className="font-medium">
            {"0.00"} {selectedPool()?.underlying}
          </span>
        </p>
        {/* Input Box: Token Input and Selection */}
        <div
          className={cn(
            "inline-flex w-full justify-between items-center border p-3 bg-transparent",
            balanceExceedError ? "border-[#FF615C]" : "border-[#1F2D3F]"
          )}
        >
          <div className="flex flex-col gap-1 items-start w-full max-w-full">
            <label htmlFor="quantity">Size</label>
            <input
              type="number"
              value={quantity}
              placeholder={`Qty (min) is 0.001 ${selectedPool()?.underlying}`}
              onChange={(event) => setQuantity(event.target.value)}
              id="quantity"
              className="bg-transparent py-2 w-full placeholder:text-[#6D6D6D] text-white font-noemal text-sm/4 focus:outline-none"
            />
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
      <ButtonCTA
        disabled={
          !isConnected ||
          !userBalance ||
          isApproveLoading ||
          !isValidPositiveNumber(quantity) ||
          balanceExceedError ||
          isApproveLoading ||
          isApprovePending ||
          isLoading ||
          (isApproveSuccess && isPending)
        } // conditions to Long Button
        onClick={approveHandler}
      >
        {isApproveLoading ||
        isApprovePending ||
        isLoading ||
        (isApproveSuccess && isPending) ? (
          <SpinnerIcon className="size-[22px]" />
        ) : (
          <span>BUY</span>
        )}
      </ButtonCTA>
      {/* Iterate this data after calculating/fetching */}
      <TradeInfo />
    </div>
  );
};

export default memo(ShortTrade);
