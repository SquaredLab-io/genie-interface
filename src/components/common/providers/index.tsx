"use client";

import { PropsWithChildren, useMemo } from "react";
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient
} from "@urql/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@lib/wagmi";
import { RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { baseSepolia } from "viem/chains";
import { SUBGRAPH_URL } from "@lib/keys";
import { theme } from "../ConnectWallet/theme";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  // React Query client setup
  const queryClient = new QueryClient();

  // URQL Client and SSR Setup
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined"
    });

    const client = createClient({
      url: SUBGRAPH_URL,
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true
    });

    return [client, ssr];
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={baseSepolia}
          modalSize="compact"
          theme={theme as Theme}
        >
          <UrqlProvider client={client} ssr={ssr}>
            {children}
          </UrqlProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
