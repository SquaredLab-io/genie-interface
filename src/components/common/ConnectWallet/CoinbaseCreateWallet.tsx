"use client";

import React, { useCallback } from "react";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { useConnect, useAccount } from "wagmi";
import { CoinbaseWalletLogo } from "@components/icons/CoinbaseIcon";

export function CoinbaseCreateWallet() {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const { isMounted } = useIsMounted();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  if (isConnected || !isMounted) return <></>;

  return (
    <button
      className="flex flex-row border-transparent box-border items-center gap-3 font-bold text-base/5 bg-coinbase-theme pl-[15px] rounded-md pr-[30px]"
      onClick={createWallet}
    >
      <CoinbaseWalletLogo size={24} />
      Create Wallet
    </button>
  );
}
