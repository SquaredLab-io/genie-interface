"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  useBalance,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { WethABi } from "@lib/abis";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import toUnits from "@lib/utils/formatting";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import ButtonCTA from "@components/common/button-cta";
import notification from "@components/common/notification";
import { CONFIRMATION } from "@lib/constants";
import { Address } from "viem";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { InfoBox } from "./info-box";
import { cn } from "@lib/utils";

const AddLiquidity = ({ overviewPool }: { overviewPool: PoolInfo }) => {
  const [amount, setAmount] = useState<string>("");
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
  const lpBalance = positionData?.lpToken.balance;

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
    const _amount = parseFloat(amount) * 10 ** 18;
    try {
      await writeApproveToken({
        abi: WethABi,
        address: overviewPool.underlyingAddress! as Address,
        functionName: "approve",
        args: [
          overviewPool.poolAddr,
          BigInt(_amount).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      console.log("error while approving", approveError);
      notification.error({
        title: "Approval confirmation failed!"
      });
    }
  };

  /**
   * Handler for Addliquidity Function
   */
  async function addLiquidityHandlerSdk() {
    const _amount = parseFloat(amount) * 10 ** 18;
    console.log("_amount", _amount);

    try {
      const hash = await potentia?.poolWrite.addLiquidity(
        overviewPool.poolAddr,
        BigInt(_amount).toString()
      );
      if (hash) {
        setTxHash(hash as Address);
        console.log("addliquiditytxn return", hash);
      }
    } catch (error) {
      console.error("Error while Adding liquidity");
    }
  }

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

  // wait for add liquidity transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  // getting underlying token's price
  const { price, isFetching: isPriceFetching } = useCurrencyPrice(underlying);

  const balanceExceedError = useMemo(
    () => !!userBalance?.value && parseFloat(amount) > parseFloat(userBalance?.formatted),
    [userBalance, amount]
  );

  // TODO: Update actual data from SDK
  const receiveQuantity = 0;

  useEffect(() => {
    // Executes Add Liquidity handlers if Approval Txn is successful
    if (isApproveSuccess) {
      console.log("Token is approved for the selected amount!");
      notification.success({
        title: "Token Approved",
        description: "You may now process to Add Liquidity"
      });
      addLiquidityHandlerSdk();
    }
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
        title: "Adding liquidity failed",
        description: `${error.message}`
      });
    } else if (isSuccess) {
      refetchBalance();
      refetchPosition();
      notification.success({
        title: "Liquidity Added Successfully"
      });
    }
  }, [isSuccess, isError, isApproveError]);

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
            <span>
              {isPriceFetching && !price && !isValidPositiveNumber(amount)
                ? "..."
                : `$${price * parseFloat(amount !== "" ? amount : "0")}`}
            </span>
          </p>
          <div className="inline-flex-between">
            <label
              className="max-w-fit inline-flex gap-2 items-center"
              htmlFor="add_liquidity_quantity"
            >
              <Image
                src={`/tokens/${overviewPool?.underlying.toLowerCase()}.svg`}
                alt="token"
                width={24}
                height={24}
              />
              <span className="font-medium text-base/5">{underlying}</span>
            </label>
            <input
              type="number"
              value={amount}
              placeholder="0"
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              id="add_liquidity_quantity"
              className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right"
            />
          </div>
          <div className="inline-flex items-end justify-between font-normal text-xs/3">
            <span
              className={cn(balanceExceedError ? "text-error-red" : "text-[#5F7183]")}
            >
              Your balance:{" "}
              {isBalLoading && !userBalance
                ? "loading..."
                : toUnits(parseFloat(userBalance?.formatted ?? "0"), 3)}
            </span>
            <div className="inline-flex gap-2">
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount((parseFloat(userBalance?.formatted ?? "0") * 0.5).toString())
                }
                disabled={!isConnected || !userBalance?.formatted}
              >
                Half
              </button>
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount(parseFloat(userBalance?.formatted ?? "0").toString())
                }
                disabled={!isConnected || !userBalance?.formatted}
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
            <h4 className="font-medium text-base/5">LP Tokens</h4>
            <span className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right">
              {receiveQuantity > 0 ? receiveQuantity : "-"}
            </span>
          </div>
          <div className="font-normal text-xs/3 mt-1">
            <span className="text-[#5F7183]">
              Your LP balance:{" "}
              {isPositionFetching && !lpBalance
                ? "loading..."
                : (parseFloat(lpBalance ?? "0") / 10 ** underlyingDecimals).toFixed(5)}
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
          <span className="font-medium">0.00 {underlying}</span>
        </div>
        <ButtonCTA
          disabled={
            !isConnected ||
            !userBalance ||
            !lpBalance ||
            balanceExceedError ||
            isApproveLoading ||
            isApprovePending ||
            isLoading ||
            (isApproveSuccess && isPending) ||
            !isValidPositiveNumber(amount)
          }
          isLoading={isApproveLoading || isLoading}
          onClick={() => {
            if (isConnected) {
              console.log("amount", amount);
              approveHandler();
            } else {
              openConnectModal?.();
            }
          }}
        >
          {isConnected ? <span>Add Liquidity</span> : <span>Connect Wallet</span>}
        </ButtonCTA>
      </div>
    </div>
  );
};

export default AddLiquidity;
