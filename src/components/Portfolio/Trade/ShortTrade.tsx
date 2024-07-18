"use client";

// Library Imports
import { FC, useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { BiSolidDownArrow } from "react-icons/bi";
import { type PotentiaSdk } from "@squaredlab-io/sdk/src";
// Component, Util Imports
import { selected_token } from "../helper";
import TokenSlider from "./TokenSlider";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import { Button } from "@components/ui/button";
import { WethABi } from "@lib/abis";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { PositionType } from "@lib/types/enums";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { useTradeStore } from "@store/tradeStore";
import TokenSelectPopover from "@components/common/TokenSelectPopover";

interface PropsType {
  potentia?: PotentiaSdk;
}

const ShortTrade: FC<PropsType> = ({ potentia }) => {
  const { selectedPool } = useTradeStore((state) => state);
  const TOKEN_ADDR = selectedPool.underlyingTokens[0].address;

  const [quantity, setQuantity] = useState("");
  const [sliderValue, setSliderValue] = useState<number[]>([25]);

  // Contract Hooks
  const { address, isConnected } = useAccount();
  const { data: userBalance, isLoading: isBalLoading } = useBalance({
    address,
    token: TOKEN_ADDR
  });

  const { data: positionData, isFetching: isPositionFetching } = useCurrentPosition(
    PositionType.short,
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
   * This handler method approves signers TOKEN_ADDR tokens to be spent on Potentia Protocol
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
      console.log("error while approving", approveError);
    }
  };

  // wait for approval transaction
  const {
    isSuccess: isTxnSuccess,
    isLoading: isTxnLoading,
    isError: isTxnError
  } = useWaitForTransactionReceipt({
    hash: approvalData
  });

  /**
   * Handler for Opening Long Position
   */
  const openShortPositionHandler = async () => {
    const _amount = parseFloat(quantity) * 10 ** 18;

    try {
      const txnHash = await potentia?.openPosition(
        selectedPool.poolAddress, // poolAddress
        BigInt(_amount).toString(), // amt
        false // isLong
      );
      console.log("txnHash", txnHash);
    } catch (error) {
      console.log("// error in open_short", error);
    } finally {
      console.log("open_short_position amount", _amount);
    }
  };

  useEffect(() => {
    // Executes if Approve Successful
    console.log("approve txn final status", isTxnSuccess);
    if (isTxnSuccess) {
      console.log("Token is approved for the selected amount!");
      openShortPositionHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTxnSuccess]);

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
        <div className="inline-flex w-full justify-between items-center border border-[#1F2D3F] p-3 bg-transparent">
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
            <button className="hover:bg-transparent px-0 flex h-10 items-center justify-between gap-0 font-normal text-sm/4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
              <span className="text-nowrap">
                {selectedPool.underlyingTokens[0].symbol}
              </span>
              <BiSolidDownArrow className="h-3 w-3 ml-4" color="#9D9D9D" />
            </button>
          </TokenSelectPopover>
        </div>
      </form>
      {/* Slider Component */}
      <div className="w-full my-4">
        <TokenSlider value={sliderValue} setValue={setSliderValue} />
      </div>
      <button
        className="bg-primary-blue hover:bg-primary-blue font-sans-ibm-plex font-medium text-[14px]/6 text-white text-center py-3 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={
          !isConnected || !userBalance || isTxnLoading || !isValidPositiveNumber(quantity)
        } // conditions to Long Button
        onClick={approveHandler}
      >
        BUY
      </button>
      {/* Iterate this data after calculating/fetching */}
      <div className="flex flex-col gap-2 mt-5 font-normal text-xs/[14px]">
        <p className="inline-flex items-center justify-between w-full">
          <span className="text-[#6D6D6D]">Fee (0.555)</span>
          <span className="font-medium">0.25%</span>
        </p>
        <p className="inline-flex items-center justify-between w-full">
          <span className="text-[#6D6D6D]">TVL</span>
          <span className="font-medium">0.25%</span>
        </p>
        <p className="inline-flex items-center justify-between w-full">
          <span className="text-[#6D6D6D]">Volume (24h)</span>
          <span className="font-medium">0.25%</span>
        </p>
        <p className="inline-flex items-center justify-between w-full">
          <span className="text-[#6D6D6D]">Conversion Fee</span>
          <span className="font-medium">0.25%</span>
        </p>
      </div>
    </div>
  );
};

export default ShortTrade;
