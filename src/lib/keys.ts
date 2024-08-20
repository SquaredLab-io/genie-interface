// API KEYS
export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";
if (!WALLET_CONNECT_PROJECT_ID) {
  console.warn("You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable");
}
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY as string;
export const CRYPRO_COMPARE_API = process.env.NEXT_PUBLIC_CRYPRO_COMPARE_API as string;

// URLS
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH as string;
export const PONDER_URL = process.env.NEXT_PUBLIC_PONDER as string;
export const BASE_SEPOLIA_RPC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC as string;