"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import {
  useBalance,
  useAccount,
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { CONTRACT_ADDRESSES } from "@lib/constants";
import { WethABi, PotentiaAbi } from "@lib/abis";
import { cn } from "@lib/utils";

const AddLiquidity = () => {
  const { POTENTIA_POOL_ADDR, WETH_ADDR } = CONTRACT_ADDRESSES;

  const [amount, setAmount] = useState("");

  // Contract Hooks
  const { address, chainId } = useAccount();
  const { data: userBalance, isLoading: isBalLoading } = useBalance({
    address,
    chainId,
    token: WETH_ADDR
  });

  // Write Hook => Token Approval
  const {
    data: approvalData,
    writeContractAsync: writeApproveToken,
    error: approveError,
    isPending: isApprovePending
  } = useWriteContract();

  // Write Hook => Add Liquidity
  const {
    data: addLiqData,
    error,
    writeContractAsync: writeAddLiquidity,
    isError,
    isPending,
    isSuccess,
    variables
  } = useWriteContract();

  // // Simulate contract before executing
  // const {
  //   data: simData,
  //   isLoading: isSimLoading,
  //   isPending: isSimPending,
  //   isError: isSimError,
  //   error: simError
  // } = useSimulateContract({
  //   abi: PotentiaPoolAbi,
  //   address: POTENTIA_POOL_ADDR,
  //   functionName: "addLiquidity",
  //   args: [BigInt(parseFloat("0.012") * 10 ** 18)],
  //   chainId
  // });

  /**
   * This handler method approves signers WETH_ADDR tokens to be spent on Potentia Protocol
   */
  const approveHandler = async () => {
    const _amount = parseFloat(amount) * 10 ** 18;
    try {
      await writeApproveToken({
        abi: WethABi,
        address: WETH_ADDR,
        functionName: "approve",
        args: [
          POTENTIA_POOL_ADDR,
          BigInt(_amount).toString() // Approving as much as input amount only
        ],
        chainId
      });
    } catch (error) {
      console.log("error while approving", approveError);
    }
  };

  /**
   * Handler method for Adding liquidity in potentia pool
   */
  const addLiquidityHandler = async () => {
    const _amount = parseFloat(amount) * 10 ** 18;
    console.log("Amount", _amount);

    try {
      await writeAddLiquidity({
        abi: PotentiaAbi,
        address: POTENTIA_POOL_ADDR,
        functionName: "addLiquidity",
        args: [BigInt(_amount).toString()],
        chainId
      });
    } catch (e) {
      console.log("error", error);
    } finally {
      console.log("AddLiq Data", addLiqData);
      console.log("variables", variables);
    }
  };

  // wait for approval transaction
  const {
    isSuccess: isTxnSuccess,
    isLoading: isTxnLoading,
    isError: isTxnError
  } = useWaitForTransactionReceipt({
    hash: approvalData,
    chainId
  });

  useEffect(() => {
    // Executes Add Liquidity handlers if Approval Txn is successful
    console.log("approve txn final status", isTxnSuccess);
    if (isTxnSuccess) {
      console.log("Token is approved for the selected amount!");
      addLiquidityHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTxnSuccess]);

  return (
    <>
      <div className="bg-primary-gray rounded-base">
        <div className="p-5 border-b border-[#2A2C30]">
          <span className="font-normal text-xs/4 text-[#8F9BAA]">Add Liquidity</span>
          <div className="relative flex flex-col text-[#D4D4D4] items-center justify-center h-60">
            <input
              className="text-7xl/[98px] font-medium w-fit max-w-[250px] bg-primary-gray outline-none text-center"
              placeholder="0"
              disabled={userBalance == undefined}
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
            <span className="font-normal text-base/5">$0</span>
          </div>
        </div>
        <div className="px-5 py-4 inline-flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-3">
            <Image src="/icons/ethereum.svg" alt="Asset icon" height={42} width={42} />
            <p className="flex flex-col justify-between font-normal text-base/5 text-[#8F9BAA]">
              <span>ETH</span>
              <span className="text-xs/4">
                Balance: {isBalLoading ? "loading balance..." : userBalance?.formatted}
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
        <span className="text-xs/4">
          LP Tokens you will recieve:{" "}
          {parseInt(userBalance?.value.toString() ?? "0") /
            10 ** (userBalance?.decimals ?? 1)}
        </span>
      </div>
      <div className="mt-1">
        <button
          className={cn(
            "w-full rounded-[3px] font-bold text-[14px] leading-6 text-center py-[14px]",
            "bg-[#202832] hover:bg-[#475B72] text-[#3D85C6] transition-colors duration-200",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#202832]"
          )}
          onClick={() => {
            console.log("amount", amount);
            approveHandler();
          }}
          disabled={isTxnLoading || isApprovePending || isPending}
        >
          Add Liquidity
        </button>
      </div>
    </>
  );
};

export default AddLiquidity;
