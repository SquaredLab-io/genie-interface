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

// Number of Blocks to confirm
export const CONFIRMATION = 5;

// export const REFETCH_INTERVAL = false; // disabled
export const REFETCH_INTERVAL = 5 * 60 * 1000; // 10 seconds

export const TOKENS: {
  [key: string]: `0x${string}`;
} = {
  WETH: getAddress("0xc632C00e28E45B8d313B9175812c470E4e1904D3")
};

export const SUPPORTED_TOKENS = [
  {
    token: "WETH",
    name: "Wrapped Ether",
    address: TOKENS.WETH,
    logo: "/tokens/weth.svg",
    decimals: 18
  }
];

export const CONTRACT_ADDRESSES = {
  POTENTIA_FACTORY_ADDR: "0x531DdAf1f0A0eC86d4892e60Fe9c869d8f22F420" as Address,
  WETH_ADDR: TOKENS.WETH
};
