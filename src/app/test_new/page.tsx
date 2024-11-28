"use client";

import { useAccount } from "wagmi";
import { useIsClient, useWindowSize } from "usehooks-ts";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { _getDecimalAdjusted } from "@lib/utils/formatting";
import Loading from "@app/loading";
import TradeButton from "../../components/Trade/trade-drawer-section/trade-buttons";

export default function TestNew() {
  const { width } = useWindowSize();
  const isClient = useIsClient();
  const { isConnected, isConnecting, address } = useAccount();

  if (width === 0 || !isClient) return <Loading />;
  return (
    <main className="relative page-center items-center justify-center gap-3">
      <span>
        Wallet status:{" "}
        {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Not Connected"}
      </span>
      {isConnected && <span>{address}</span>}
      <div className="flex flex-row items-center gap-2 mb-4 w-full max-h-fit absolute bottom-7 px-3">
        <TradeButton variant={"long"} className="w-1/2 float-left">
          Long
        </TradeButton>
        <TradeButton variant={"short"} className="w-1/2 float-right">
          Short
        </TradeButton>
      </div>
    </main>
  );
}
