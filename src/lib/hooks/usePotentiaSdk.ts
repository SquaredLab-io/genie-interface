import { useEffect } from "react";
import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { PotentiaSdk } from "@squaredlab-io/sdk/src";
import { BASE_SEPOLIA_RPC, CONTRACT_ADDRESSES } from "@lib/constants";
import { createPublicClient, http, type PublicClient } from "viem";
import { baseSepolia } from "viem/chains";

export const usePotentiaSdk = () => {
  let potentia: PotentiaSdk | undefined;
  // const publicClient = usePublicClient();
  const { data: walletClient, status } = useWalletClient();
  const { address, chainId } = useAccount();

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http()
  });

  function assignValue() {
    if (address && chainId && status == "success") {
      potentia = new PotentiaSdk(publicClient as PublicClient, walletClient);
      console.log("client", publicClient);
      console.log("walletclient", walletClient);
      console.log("potentia", potentia);
      // potentia.addLiquidity(CONTRACT_ADDRESSES.POTENTIA_POOL_ADDR, "20");
    }
  }

  useEffect(() => {
    assignValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient, address]);

  return {
    potentia
  };
};
