"use client";

import { useAccount, useWalletClient } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { Button } from "@components/ui/button";
import { usePools } from "@lib/hooks/usePools";
import { Client, serializeAccessList } from "viem";
import notification from "@components/common/notification";

export default function TestNew() {
  const isClient = useIsClient();

  const { pools, isFetching, refetch } = usePools(true);

  const { address, isConnected } = useAccount();
  const { data: walletClient, status } = useWalletClient();

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  async function addToken() {
    try {
      const success = await walletClient?.watchAsset({
        type: "ERC20",
        options: {
          address: "0x023f4Ef5A1AA177b07990B9B964BCbAc2Bd29d85",
          decimals: 18,
          symbol: "WETH"
        }
      });
      notification.success({
        title: "WETH added in the wallet",
        description: "Please check in the wallet"
      });
    } catch (error) {
      notification.error({
        title: "Sorry mate, it didn't workout!",
        description: `${error}`
      });
    }
  }

  return (
    <main className="flex-col-center gap-3">
      <p>{!address ? "Connect wallet first!" : `Connected: ${address}`}</p>
      <Button onClick={refetch}>Fetch pools</Button>

      <Button variant="secondary" disabled={!isConnected} onClick={addToken}>
        Add WETH to Wallet
      </Button>

      <h4>
        {isFetching
          ? "fetching pools..."
          : pools.length > 0
            ? `${pools[0].pool} fetched`
            : "not fetching"}
      </h4>
    </main>
  );
}
