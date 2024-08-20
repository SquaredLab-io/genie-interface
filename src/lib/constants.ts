import { Address, getAddress } from "viem";
// import { ALCHEMY_KEY } from "./keys";

// App State
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "production";

// Base Sepolia RPC URL
// Moved to environment variables

//
// App's Metadata all at one place
//
export const meta = {
  APP_NAME: "Genie DEX",
  DESCRIPTION:
    "Genie is an entire derivatives ecosystem without liquidation! Powered by Potentia Protocol.",
  KEYWORDS: [
    "Derivatives",
    "Liquidation",
    "Trading",
    "Perpetuals",
    "DeFi",
    "Power Perpetuals",
    "Leveraged Trading"
  ],
  URL: "https://genie.squaredlabs.io",
  DOMAIN: "https://squaredlabs.io",
  IMAGE: "https://frontend-web-resources.s3.amazonaws.com/og-large.png",
  SITE_NAME: "genie.squaredlabs.io",
  USERNAME: "@squaredlabs_",
  TWITTER: "https://x.com/SquaredLabs_",
  DISCORD: "https://discord.gg/yMe2kkKP",
  TELEGRAM: "https://t.me/squaredlabs",
  DOCS: "https://squaredlabs-io.gitbook.io/squaredlabs.io",
  LOGO: "/images/logo.svg",
  SUPPORT_MAIL: "genie@squaredlabs.io"
};

// Header navigation links
export const navigation: {
  name: string;
  href: string;
  target: string;
}[] = [
  { name: "Trades", href: "/", target: "" },
  { name: "Pools", href: "/pools", target: "" }
  // { name: "Test", href: "/test_new", target: "" }
];

export const SUPPORTED_NETWORKS = [
  {
    NAME: "Base Sepolia",
    PROTOCOL: "Potentia V1",
    LOGO: "/images/base_logo.svg"
  }
];
export const BASE_SEPOLIA = SUPPORTED_NETWORKS[0];

export const CONFIRMATION = 5;

// export const REFETCH_INTERVAL = false; // disabled
export const REFETCH_INTERVAL = 5 * 60 * 1000; // 10 seconds

export const TOKENS: {
  [key: string]: `0x${string}`;
} = {
  WETH: getAddress("0x023f4Ef5A1AA177b07990B9B964BCbAc2Bd29d85"),
  USDC: getAddress("0x653cfb1cDAC92aa4d954ac06084B510c5ED9AEA9")
};

export const SUPPORTED_TOKENS = [
  {
    token: "WETH",
    name: "Wrapped Ether",
    address: TOKENS.WETH,
    logo: "/tokens/weth.svg"
  },
  {
    token: "USDC",
    name: "USD Coin",
    address: TOKENS.USDC,
    logo: "/tokens/usdc.svg"
  }
];

export const CONTRACT_ADDRESSES = {
  POTENTIA_FACTORY_ADDR: "0x7c6Df75398aFDd677E1576bC4EBAAC2ff92c102d" as Address,
  WETH_ADDR: TOKENS.WETH,
  WETH_POOL_ADDR: "0x4765D8b39E73e20943Ff81E00b56b2B3AA5FfAa5" as Address,
  USDC_ADDR: TOKENS.USDC,
  USDC_POOL_ADDR: "0x668f40dADca1c641ef687bee8949a5b4304aaBfB" as Address
};
