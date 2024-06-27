import React, { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";
import { CoinbaseWalletLogo } from "@components/icons/CoinbaseIcon";

export function CoinbaseCreateWallet() {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  if (isConnected) return <></>;

  return (
    <button
      className="bg-transparent border-transparent box-border flex items-center justify-between w-[200px] font-sans-manrope font-bold text-[18px] bg-[#0052FF] pl-[15px] rounded-[10px] pr-[30px]"
      onClick={createWallet}
    >
      <CoinbaseWalletLogo />
      Create Wallet
    </button>
  );
}
