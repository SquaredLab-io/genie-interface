import { WALLET_CONNECT_PROJECT_ID } from "@lib/keys";
import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { meta } from "./constants";

export const config = createConfig(
  getDefaultConfig({
    // NETWORKS INFO
    chains: [baseSepolia, base],
    connectors: [
      metaMask({
        dappMetadata: {
          name: meta.APP_NAME,
          url: meta.URL
          // iconUrl: "/icon.svg" // put a icon URL here that starts with https://
        }
      }),
      walletConnect({
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: meta.APP_NAME,
          description: meta.DESCRIPTION,
          url: meta.URL,
          icons: ["/icon.svg"]
        }
      }),
      coinbaseWallet()
    ],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http()
    },
    // REQUIRED WALLET CONNECT API KEY
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
    // APP INFO
    appName: meta.APP_NAME,
    appDescription: meta.DESCRIPTION,
    appUrl: meta.URL,
    appIcon: "/images/logo.svg"
  })
);
