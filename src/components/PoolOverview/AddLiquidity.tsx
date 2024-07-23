"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useBalance,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { WethABi } from "@lib/abis";
import { cn } from "@lib/utils";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import toUnits from "@lib/utils/formatting";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { PoolOptions, potentiaPools } from "@lib/pools";
import ButtonCTA from "@components/common/button-cta";
import { HiInformationCircle } from "react-icons/hi2";
import { Info } from "lucide-react";

const AddLiquidity = () => {
  // const { overviewPool } = useTradeStore();
  // TODO: Update this with currentPool
  const overviewPool = potentiaPools[PoolOptions.weth];
  const TOKEN = overviewPool.underlyingTokens[0];

  const { potentia } = usePotentiaSdk();
  const { openConnectModal } = useConnectModal();

  const [amount, setAmount] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(true);

  // Contract Hooks
  const { address, isConnected } = useAccount();
  const { data: userBalance, isLoading: isBalLoading } = useBalance({
    address,
    token: TOKEN.address
  });

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
        address: TOKEN.address,
        functionName: "approve",
        args: [
          overviewPool.poolAddress,
          BigInt(_amount).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      console.log("error while approving", approveError);
    }
  };

  /**
   * Handler for Addliquidity from SDK
   */
  async function addLiquidityHandlerSdk() {
    const _amount = parseFloat(amount) * 10 ** 18;
    console.log("_amount", _amount);

    const txn = await potentia?.addLiquidity(
      overviewPool.poolAddress,
      BigInt(_amount).toString()
    );
    console.log("addliquiditytxn return", txn);
    return txn;
  }

  // wait for approval transaction
  const {
    isSuccess: isTxnSuccess,
    isLoading: isTxnLoading
    // isError: isTxnError
  } = useWaitForTransactionReceipt({
    hash: approvalData
  });

  useEffect(() => {
    // Executes Add Liquidity handlers if Approval Txn is successful
    console.log("approve txn final status", isTxnSuccess);
    if (isTxnSuccess) {
      console.log("Token is approved for the selected amount!");
      addLiquidityHandlerSdk();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTxnSuccess]);

  return (
    <div className="flex flex-col justify-between py-4 h-full">
      <div className="w-full space-y-3">
        {/* SUPPLY */}
        <div className="rounded-[4px] border-x-secondary-gray flex flex-col gap-y-2 border border-secondary-gray p-4">
          <p className="w-full inline-flex justify-between font-medium text-xs/3 text-[#5F7183] mb-1">
            <span>You Supply</span>
            <span>~$0.00</span>
          </p>
          <div className="inline-flex-between">
            <div className="max-w-fit inline-flex gap-2 items-center">
              <Image src={TOKEN.icon} alt="token" width={24} height={24} />
              <span className="font-medium text-base/5">{TOKEN.symbol}</span>
            </div>
            <input
              className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right"
              placeholder="0"
              disabled={userBalance == undefined}
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </div>
          <div className="inline-flex items-end justify-between font-normal text-xs/3">
            <span className="text-[#5F7183]">
              Your balance:{" "}
              {isBalLoading
                ? "loading balance..."
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
              0
            </span>
          </div>
          <div className="font-normal text-xs/3 mt-1">
            <span className="text-[#5F7183]">Your LP balance: 0</span>
          </div>
        </div>
        {showInfo && (
          <div className="flex flex-row items-center justify-between mt-2 bg-[#00456D14] bg-opacity-10 py-4 px-6 gap-4 rounded-[4px] border border-[#01A1FF] w-full">
            <Info size={22} color="#01A1FF" />
            <p className="font-normal text-sm/[18px] max-w-72">
              The tokens in your wallet are being converted automatically by Genie for a
              small fee.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <div className="inline-flex-between text-xs/[14px]">
          <span className="font-normal text-[#757B80]">Conversion Fee</span>
          <span className="font-medium">0.000 BTC</span>
        </div>
        <ButtonCTA
          className={cn(
            "w-full font-bold text-[14px] leading-6 text-center py-[14px]",
            "bg-[#202832] hover:bg-[#475B72] text-[#3D85C6] transition-colors duration-200",
            "disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-[#202832]"
          )}
          onClick={() => {
            if (isConnected) {
              console.log("amount", amount);
              approveHandler();
            } else {
              openConnectModal?.();
            }
          }}
          disabled={
            isConnected &&
            (isTxnLoading ||
              isApprovePending ||
              // isEmpty(amount) ||
              !isValidPositiveNumber(amount))
          }
        >
          {isConnected ? <span>Add Liquidity</span> : <span>Connect Wallet</span>}
        </ButtonCTA>
      </div>
    </div>
  );
};

export default AddLiquidity;
