import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { PotentiaSdk } from "@squaredlab-io/sdk/src";
import { PONDER_URL, SUBGRAPH_URL } from "@lib/keys";

/**
 * Hook to creates a Potentia SDK instance after a user is connected
 * @returns Potentia SDK Instance
 */
export const usePotentiaSdk = () => {
  const [potentia, setPotentia] = useState<PotentiaSdk | undefined>(undefined);

  // const { address, chainId } = useAccount();
  const { data: walletClient, status } = useWalletClient();

  const publicClient: any = createPublicClient({
    chain: baseSepolia,
    transport: http()
  });

  async function userConnected() {
    // if (address && chainId && status == "success") {
    // Now Potentia doesn't need user to be connected to initiate
    const potentia = new PotentiaSdk(
      publicClient,
      // walletClient,
      SUBGRAPH_URL,
      PONDER_URL
    );
    setPotentia(potentia);
  }

  useEffect(() => {
    userConnected();
  }, []);
  // }, [walletClient, address]);

  useEffect(() => {
    if (potentia !== undefined && status == "success") {
      potentia.initialiseSDK(walletClient);
    }
  }, [potentia, walletClient]);

  return {
    potentia
  };
};
