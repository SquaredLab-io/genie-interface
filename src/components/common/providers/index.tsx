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
import { ConnectKitProvider } from "connectkit";
import { config } from "@lib/wagmi";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  // React Query client setup
  const queryClient = new QueryClient();

  // URQL Client and SSR Setup
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined"
    });

    const client = createClient({
      url: "https://trygql.formidable.dev/graphql/basic-pokedex",
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true
    });

    return [client, ssr];
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          options={{
            embedGoogleFonts: true,
            disclaimer: connectDisclaimer
          }}
        >
          <UrqlProvider client={client} ssr={ssr}>
            {children}
          </UrqlProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const connectDisclaimer = (
  <>
    By continuing, you agree to the{" "}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://en.wikipedia.org/wiki/Terms_of_service"
    >
      Terms of Service
    </a>{" "}
    and{" "}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://en.wikipedia.org/wiki/Privacy_policy"
    >
      Privacy Policy
    </a>
  </>
);

export default Providers;
