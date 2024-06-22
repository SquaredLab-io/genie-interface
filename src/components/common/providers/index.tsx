"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { config } from "@lib/wagmi";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="midnight">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
