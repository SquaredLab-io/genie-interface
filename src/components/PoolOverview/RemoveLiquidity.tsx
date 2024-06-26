"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useReadContract,
  useAccount,
  useBalance,
  useReadContracts,
  useWriteContract
} from "wagmi";
import { HiChevronDown } from "react-icons/hi2";
import { CONTRACT_ADDRESSES } from "@lib/constants";
import { balanceOfAbi, PotentiaAbi } from "@lib/abis";
import { Address } from "viem";

const RemoveLiquidity = () => {
  const { PTOKEN_ADDR, POTENTIA_POOL_ADDR, WETH_ADDR } = CONTRACT_ADDRESSES;
  const [amount, setAmount] = useState("");

  const { chainId, address } = useAccount();

  // Balance of pToken
  const { data: pToken, isLoading } = useReadContract({
    abi: PotentiaAbi,
    address: POTENTIA_POOL_ADDR,
    functionName: "pTokens",
    args: []
  });

  useEffect(() => {
    console.log("pTokens", (pToken as any)?.data);
  }, [pToken]);

  // Balance of pToken
  const {
    data: pTokenBalance,
    isLoading: isBalanceLoading,
    isError,
    error
  } = useReadContract({
    abi: balanceOfAbi,
    address: PTOKEN_ADDR,
    functionName: "balanceOf",
    args: [address as Address, 0]
  });

  // Write Hook => Remove Liquidity
  const {
    data: removeLiqData,
    error: errorRemoveLiq,
    writeContractAsync: writeRemoveLiquidity,
    isError: isRemoveLiqError,
    isPending: isRemoveLiqPending,
    isSuccess: isRemoveLiqSuccess,
    variables
  } = useWriteContract();

  /**
   * Handler method for Adding liquidity in potentia pool
   */
  const removeLiquidityHandler = async () => {
    const _amount = parseFloat(amount) * 10 ** 18;
    console.log("Amount", _amount);

    try {
      await writeRemoveLiquidity({
        abi: PotentiaAbi,
        address: POTENTIA_POOL_ADDR,
        functionName: "removeLiquidity",
        args: [BigInt(_amount).toString()], // _shares (uint256)
        chainId
      });
    } catch (e) {
      console.log("error", error?.message);
    } finally {
      console.log("RemoveLiquidity Data", removeLiqData);
      console.log("variables", variables);
    }
  };

  useEffect(() => {
    console.log("tokenbalance", pTokenBalance);
  }, [pTokenBalance]);

  return (
    <>
      <div className="bg-primary-gray rounded-base">
        <div className="p-5 border-b border-[#2A2C30]">
          <span className="font-normal text-xs/4 text-[#8F9BAA]">Remove Liquidity</span>
          <div className="relative flex flex-col text-[#D4D4D4] items-center justify-center h-60">
            <input
              className="text-7xl/[98px] font-medium w-fit max-w-[250px] bg-primary-gray outline-none text-center"
              placeholder="0"
              disabled={pTokenBalance == undefined}
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
            <span className="font-normal text-base/5">$0</span>
          </div>
        </div>
        {isBalanceLoading ? (
          <p>isloading...</p>
        ) : pTokenBalance ? (
          <p>{pTokenBalance.toString()}</p>
        ) : isError ? (
          <p>{error.message}</p>
        ) : (
          <p>nothing</p>
        )}
        <div className="px-5 py-4 inline-flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-3">
            <Image src="/icons/ethereum.svg" alt="Asset icon" height={42} width={42} />
            <p className="flex flex-col justify-between font-normal text-base/5 text-[#8F9BAA]">
              <span>ETH</span>
              <span className="text-xs/4">Balance: 0</span>
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
            removeLiquidityHandler();
          }}
        >
          Remove Liquidity
        </button>
      </div>
      {/* <p>
        {isRemoveLiqSuccess
          ? "is success"
          : isRemoveLiqPending
            ? "is pending..."
            : isRemoveLiqError
              ? "is error"
              : "nothing"}
      </p> */}
    </>
  );
};

export default RemoveLiquidity;
