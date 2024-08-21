"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Address } from "viem";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useAccount, useBalance, useWaitForTransactionReceipt } from "wagmi";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";
import toUnits from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import notification from "@components/common/notification";
import InfoBox from "../info-box";

const RemoveLiquidity = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  // Amount to remove
  const [amount, setAmount] = useState("");
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [txHash, setTxHash] = useState<Address | undefined>(undefined);

  const { potentia } = usePotentiaSdk();
  const { openConnectModal } = useConnectModal();

  const { underlying, poolAddr, underlyingAddress, underlyingDecimals } = overviewPool;

  // Contract Hooks
  const { address, isConnected } = useAccount();
  const {
    data: userBalance,
    isLoading: isBalLoading,
    refetch: refetchBalance
  } = useBalance({
    address,
    token: underlyingAddress! as Address
  });

  // Current positions
  const {
    data: positionData,
    isFetching: isPositionFetching,
    refetch: refetchPosition
  } = useCurrentPosition({ poolAddress: poolAddr as Address });
  const lpBalance =
    parseFloat(positionData?.lpToken.balance ?? "0") /
    10 ** overviewPool.underlyingDecimals;

  /**
   * Handler for RemoveLiquidity Function
   */
  async function removeLiquidityHandlerSdk() {
    const shares = parseFloat(amount) * 10 ** 18;
    console.log("Amount", shares);

    try {
      const hash = await potentia?.poolWrite.removeLiquidity(
        overviewPool.poolAddr as Address,
        BigInt(shares).toString()
      );
      if (hash) {
        setTxHash(hash as Address);
        console.log("removeliquidity hash", hash);
      }
    } catch (error) {
      console.error("RemoveLiquidity Error", error);
    }
  }

  // wait for add liquidity transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  const balanceExceedError = useMemo(() => {
    console.log(
      "parseFloat(amount) > lpBalance",
      parseFloat(amount),
      lpBalance,
      parseFloat(amount) > lpBalance
    );
    return parseFloat(amount) > lpBalance;
  }, [lpBalance, amount]);

  // TODO: Update actual data from SDK
  const receiveQuantity = 0;

  // Notifications based on Transaction status
  useEffect(() => {
    if (isError) {
      notification.error({
        id: "add-error",
        title: "Adding liquidity failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      refetchBalance();
      refetchPosition();
      notification.success({
        id: "add-success",
        title: "Liquidity withdrawn successfully"
      });
    }
  }, [isSuccess, isError]);

  return (
    <div className="flex flex-col justify-between py-4 h-full">
      <div className="w-full space-y-3">
        {/* SUPPLY */}
        <div
          className={cn(
            "rounded-[4px] flex flex-col gap-y-2 border p-4",
            balanceExceedError ? "border-error-red" : "border-secondary-gray"
          )}
        >
          <p className="w-full inline-flex justify-between font-medium text-xs/3 text-[#5F7183] mb-1">
            <span>You Supply</span>
            <span>~$0.00</span>
          </p>
          <div className="inline-flex-between">
            <h4 className="font-medium text-base/5">LP Tokens</h4>
            <input
              className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </div>
          <div className="inline-flex items-end justify-between font-normal text-xs/3">
            <span
              className={cn(balanceExceedError ? "text-error-red" : "text-[#5F7183]")}
            >
              Your LP balance:{" "}
              {isPositionFetching && !lpBalance ? "loading..." : lpBalance.toFixed(5)}
            </span>
            <div className="inline-flex gap-2">
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => setAmount((lpBalance * 0.5).toString())}
                disabled={!isConnected || !lpBalance}
              >
                Half
              </button>
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => setAmount(lpBalance.toString())}
                disabled={!isConnected || !lpBalance}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        {/* YOU RECEIVE */}
        <div className="rounded-[4px] border-x-secondary-gray flex flex-col gap-y-2 border border-secondary-gray p-4">
          <p className="w-full inline-flex justify-between font-medium text-xs/3 text-[#5F7183]">
            <span>You Receive</span>
            <span>~$0.00</span>
          </p>
          <div className="inline-flex-between">
            <div className="max-w-fit inline-flex gap-2 items-center">
              <Image
                src={`/tokens/${underlying}.svg`}
                alt="token"
                width={24}
                height={24}
              />
              <span className="font-medium text-base/5">{underlying}</span>
            </div>
            <span className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right">
              {receiveQuantity > 0 ? receiveQuantity : "-"}
            </span>
          </div>
          <div className="font-normal text-xs/3 mt-1">
            <span className="text-[#5F7183]">
              Your balance:{" "}
              {isBalLoading && !userBalance
                ? "loading..."
                : toUnits(parseFloat(userBalance?.formatted ?? "0"), 3)}
            </span>
          </div>
        </div>
        {showInfo && (
          <InfoBox
            isError={balanceExceedError}
            message={
              balanceExceedError
                ? "Insufficient funds. Please deposit more tokens to add the required liquidity."
                : undefined
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <div className="inline-flex-between text-xs/[14px]">
          <span className="font-normal text-[#757B80]">Conversion Fee</span>
          <span className="font-medium">0.000 {underlying}</span>
        </div>
        <ButtonCTA
          disabled={
            !isConnected ||
            !userBalance ||
            balanceExceedError ||
            !positionData ||
            isLoading ||
            !isValidPositiveNumber(amount)
          }
          onClick={() => {
            if (isConnected) {
              console.log("amount", amount);
              removeLiquidityHandlerSdk();
            } else {
              openConnectModal?.();
            }
          }}
          isLoading={isLoading}
          className={cn(
            "w-full font-bold text-[14px] leading-6 text-center py-[14px]",
            "bg-[#202832] hover:bg-[#475B72] text-[#3D85C6] transition-colors duration-200",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#202832]"
          )}
        >
          {isConnected ? <span>Remove Liquidity</span> : <span>Connect Wallet</span>}
        </ButtonCTA>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
