"use client";

import { useState } from "react";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi2";
import { CONTRACT_ADDRESSES } from "@lib/constants";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { PositionType } from "@lib/types/enums";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";

const RemoveLiquidity = () => {
  const { POTENTIA_POOL_ADDR } = CONTRACT_ADDRESSES;
  // Amount to remove
  const [amount, setAmount] = useState("");

  const { potentia } = usePotentiaSdk();

  // pToken Balance
  const { data: pTokenData, isFetching: isPTokeneFetching } = useCurrentPosition(
    PositionType.lp
  );

  /**
   * Handler for RemoveLiquidity from SDK
   */
  async function removeLiquidityHandlerSdk() {
    const shares = parseFloat(amount) * 10 ** 18;
    console.log("Amount", shares);

    const txnHash = await potentia?.removeLiquidity(
      POTENTIA_POOL_ADDR,
      BigInt(shares).toString()
    );
    console.log("removeliquidity hash", txnHash);
    return txnHash;
  }

  return (
    <>
      <div className="bg-primary-gray rounded-base">
        <div className="p-5 border-b border-[#2A2C30]">
          <span className="font-normal text-xs/4 text-[#8F9BAA]">Remove Liquidity</span>
          <div className="relative flex flex-col text-[#D4D4D4] items-center justify-center h-60">
            <input
              className="text-7xl/[98px] font-medium w-fit max-w-[250px] bg-primary-gray outline-none text-center"
              placeholder="0"
              disabled={pTokenData == undefined}
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="px-5 py-4 inline-flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-3">
            <Image src="/icons/ethereum.svg" alt="Asset icon" height={42} width={42} />
            <p className="flex flex-col justify-between font-normal text-base/5 text-[#8F9BAA]">
              <span>pToken</span>
              <span className="text-xs/4">
                Balance:{" "}
                {isPTokeneFetching
                  ? "Fetching..."
                  : pTokenData.formatted
                    ? pTokenData.formatted
                    : ""}
              </span>
            </p>
          </div>
          <button className="p-2 -m-2 rounded-full">
            <HiChevronDown size={10} color="#8F9BAA" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-base bg-primary-gray py-4 px-5 mt-1 font-normal text-base/5 text-[#8F9BAA]">
        <span>LP Tokens</span>
        <span className="text-xs/4">LP Tokens you will recieve: 0</span>
      </div>
      <div className="mt-1">
        <button
          className="w-full bg-[#202832] hover:bg-[#475B72] rounded-[3px] font-bold text-[14px] leading-6 text-[#3D85C6] text-center py-[14px] transition-colors duration-200"
          onClick={() => {
            removeLiquidityHandlerSdk();
          }}
        >
          Remove Liquidity
        </button>
      </div>
    </>
  );
};

export default RemoveLiquidity;
