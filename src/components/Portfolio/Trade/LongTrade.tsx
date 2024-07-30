"use client";

// Library Imports
import { FC, useEffect, useMemo, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { type PotentiaSdk } from "@squaredlab-io/sdk/src";
// Component, Util Imports
import { selected_token } from "../helper";
import SliderBar from "../../common/SliderBar";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import { WethABi } from "@lib/abis";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { PositionType } from "@lib/types/enums";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { useTradeStore } from "@store/tradeStore";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";
import notification from "@components/common/notification";
import TradeInfo from "./TradeInfo";

interface PropsType {
  potentia?: PotentiaSdk;
}

const LongTrade: FC<PropsType> = ({ potentia }) => {
  const [quantity, setQuantity] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number[]>([25]);

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { selectedPool } = useTradeStore((state) => state);
  const TOKEN_ADDR = selectedPool.underlyingTokens[0].address;

  // Contract Hooks
  const { address, isConnected } = useAccount();

  const { data: userBalance, isLoading: isBalLoading, refetch: refetchBalance } = useBalance({
    address,
    token: TOKEN_ADDR
  });

  // Current Open Long Position
  const { data: positionData, isFetching: isPositionFetching, refetch: refetchPosition } = useCurrentPosition(
    PositionType.long,
    selectedPool.poolAddress
  );

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
        address: TOKEN_ADDR,
        functionName: "approve",
        args: [
          selectedPool.poolAddress,
          BigInt(_amount).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      notification.error({
        title: "Token approval failed!",
        description: `${approveError?.name}`
      });
      console.log("Token approval failed", error);
    }
  };

  console.log("ApproveError", approveError);

  // wait for approval transaction
  const {
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    isError: isApproveError,
    error: approvalError
  } = useWaitForTransactionReceipt({
    hash: approvalData
  });

  // wait for openPosition transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash
    });

  /**
   * Handler for Opening Long Position
   */
  const openLongPositionHandler = async () => {
    const _amount = parseFloat(quantity) * 10 ** 18;
    try {
      const hash = await potentia?.pool.openPosition(
        selectedPool.poolAddress, // poolAddress
        BigInt(_amount).toString(), // amt
        true // isLong
      );
      // set txHash in a state
      if (hash) {
        setTxHash(hash as `0x${string}`);
        console.log("txnHash", hash);
      }
    } catch (e) {
      notification.error({
        title: "Opening Long position failed",
        description: `${error?.name}`
      });
      console.log("Opening Long position failed", error);
    } finally {
      console.log("open_long_position _amount", _amount);
    }
  };

  const balanceExceedError = useMemo(
    () =>
      !!userBalance?.value && parseFloat(quantity) >= parseFloat(userBalance?.formatted),
    [userBalance, quantity]
  );

  // Executes if Approve Successful
  useEffect(() => {
    console.log("approve txn final status", isApproveSuccess);
    if (isApproveSuccess) {
      console.log("Token is approved for the selected amount!");
      openLongPositionHandler();
      notification.success({
        title: "Token Approved",
        description: "You may now process to Opening a long position"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess]);

  // Slider value updater
  useEffect(() => {
    if (userBalance?.value) {
      const amount = (parseFloat(userBalance?.formatted) * sliderValue[0]) / 100;
      setQuantity(amount.toString());
    }
  }, [userBalance, sliderValue]);

  // Notifications based on Transaction status
  useEffect(() => {
    if (isApproveError) {
      notification.error({
        title: "Approval failed",
        description: `${approvalError.message}`
      });
    } else if (isError) {
      notification.error({
        title: "Opening long position failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      refetchBalance();
      refetchPosition();
      notification.success({
        title: "Long position successfully opened!"
      });
    }
  }, [isSuccess, isError, isApproveError]);

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
            {positionData.formatted} {selectedPool.underlyingTokens[0].symbol}
            <sup>{selected_token.power}</sup>
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
            {"0.00"} {selectedPool.underlyingTokens[0].symbol}
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
              placeholder={`Qty (min) is 0.001 ${selectedPool.underlyingTokens[0].symbol}`}
              onChange={(event) => setQuantity(event.target.value)}
              id="quantity"
              className="bg-transparent py-2 w-full placeholder:text-[#6D6D6D] text-white font-noemal text-sm/4 focus:outline-none"
            />
          </div>
          <TokenSelectPopover>
            <button
              // variant="ghost"
              className="hover:bg-transparent px-0 flex h-10 items-center justify-between gap-0 font-normal text-sm/4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <span className="text-nowrap">
                {selectedPool.underlyingTokens[0].symbol}
              </span>
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
      {/* CTA: BUY LONG TRADE BUTTON */}
      <ButtonCTA
        disabled={
          !isConnected ||
          !userBalance ||
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

export default LongTrade;
