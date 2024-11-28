"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { _getDecimalAdjusted } from "@lib/utils/formatting";
import Loading from "@app/loading";
import TradeDrawerSection from "@components/Trade/trade-drawer-section";

export default function TestNew() {
  const isClient = useIsClient();
  const { isConnected, isConnecting, address } = useAccount();

  const connectionStatus = useMemo(() => {
    if (isConnecting) return "connecting...";
    else if (isConnected) return "connected";
    return "not connected";
  }, [isConnecting, isConnected]);

  if (!isClient) return <Loading />;
  return (
    <main className="relative page-center items-center justify-center gap-3">
      <span>user status: {connectionStatus}</span>
      {isConnected && <span>{address}</span>}
      <TradeDrawerSection />
    </main>
  );
}
