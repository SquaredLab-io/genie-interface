import { Address, getAddress } from "viem";

// App State
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "production";

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
  DOCS: "https://docs.squaredlabs.io/",
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

// Number of Blocks to confirm
export const CONFIRMATION = 10;

// export const REFETCH_INTERVAL = false; // disabled
export const REFETCH_INTERVAL = 60 * 1000; // 1 minute

export const TOKENS: {
  [key: string]: `0x${string}`;
} = {
  WETH: getAddress("0x08EF999e4383FE62660022b73D145201bD5023d4"),
  ETH: getAddress("0x0000000000000000000000000000000000000000")
};

export const SUPPORTED_TOKENS = [
  {
    token: "WETH",
    name: "Wrapped Ether",
    address: TOKENS.WETH,
    logo: "/tokens/weth.svg",
    decimals: 18
  },
  {
    token: "ETH",
    name: "Ether",
    address: TOKENS.ETH,
    logo: "/tokens/eth.svg",
    decimals: 18
  }
];