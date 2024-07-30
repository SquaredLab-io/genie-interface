"use client";

import { useState } from "react";
import Image from "next/image";
import { HiChevronDown } from "react-icons/hi2";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { PositionType } from "@lib/types/enums";
import { useCurrentPosition } from "@lib/hooks/useCurrentPosition";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { cn } from "@lib/utils";
import { useTradeStore } from "@store/tradeStore";
import { PoolOptions, potentiaPools } from "@lib/pools";
import ButtonCTA from "@components/common/button-cta";
import toUnits from "@lib/utils/formatting";
import { Info } from "lucide-react";

const RemoveLiquidity = () => {
  // TODO: Update this with currentPool
  const overviewPool = potentiaPools[PoolOptions.weth];
  const TOKEN = overviewPool.underlyingTokens[0];

  // Amount to remove
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showInfo, setShowInfo] = useState<boolean>(true);

  const { potentia } = usePotentiaSdk();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // pToken Balance
  const { data: pTokenData, isFetching: isPTokenFetching } = useCurrentPosition(
    PositionType.lp,
    overviewPool.poolAddress
  );

  /**
   * Handler for RemoveLiquidity from SDK
   */
  async function removeLiquidityHandlerSdk() {
    const shares = parseFloat(amount) * 10 ** 18;
    console.log("Amount", shares);
    setIsLoading(true);

    try {
      const txnHash = await potentia?.pool.removeLiquidity(
        overviewPool.poolAddress,
        BigInt(shares).toString()
      );
      console.log("removeliquidity hash", txnHash);
    } catch (error) {
      console.error("RemoveLiquidity Error", error);
    } finally {
      setIsLoading(false);
    }
  }

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
            <h4 className="font-medium text-base/5">LP Tokens</h4>
            <input
              className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right"
              placeholder="0"
              disabled={pTokenData == undefined}
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
              {isPTokenFetching
                ? "loading balance..."
                : toUnits(parseFloat(pTokenData?.formatted ?? "0"), 3)}
            </span>
            <div className="inline-flex gap-2">
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount((parseFloat(pTokenData?.formatted ?? "0") * 0.5).toString())
                }
                disabled={!isConnected || !pTokenData?.formatted}
              >
                Half
              </button>
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount(parseFloat(pTokenData?.formatted ?? "0").toString())
                }
                disabled={!isConnected || !pTokenData?.formatted}
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
              <Image src={TOKEN.icon} alt="token" width={24} height={24} />
              <span className="font-medium text-base/5">{TOKEN.symbol}</span>
            </div>
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
              removeLiquidityHandlerSdk();
            } else {
              openConnectModal?.();
            }
          }}
          disabled={isConnected && (isLoading || !isValidPositiveNumber(amount))}
        >
          {isConnected ? <span>Remove Liquidity</span> : <span>Connect Wallet</span>}
        </ButtonCTA>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
