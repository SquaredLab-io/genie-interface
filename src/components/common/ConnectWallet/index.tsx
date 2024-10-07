"use client";

import {
  _getDecimalAdjusted,
  formatNumber,
  getDecimalAdjusted
} from "@lib/utils/formatting";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { data, isLoading, isSuccess } = useBalance({
    address
  });

  const NativeBalance = () =>
    useMemo(
      () => (
        <div className="inline-flex items-center gap-x-2">
          <Image
            src="/tokens/eth.svg"
            alt="ETH balance"
            width={24}
            height={24}
            priority
          />
          <span>
            {isLoading
              ? "..."
              : isSuccess
                ? getDecimalAdjusted(data.value.toString(), data.decimals).toFixed(4)
                : "0"}
          </span>
        </div>
      ),
      [data, isLoading, isSuccess]
    );

  return (
    <>
      {isConnected && <NativeBalance />}
      <ConnectButton label="Connect Wallet" showBalance={false} />
    </>
  );
};

export default ConnectWallet;
