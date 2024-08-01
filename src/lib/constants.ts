import { Address } from "viem";
import { ALCHEMY_KEY } from "./keys";

// App State
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "production";

// Base Sepolia RPC URL
export const BASE_SEPOLIA_RPC = `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`;

//
// App's Metadata all at one place
//
export const meta = {
  APP_NAME: "Genie | SquaredLabs",
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
  SUPPORT_MAIL: "support@squaredlabs.io"
};

// Header navigation links
export const navigation: {
  name: string;
  href: string;
  target: string;
}[] = [
  { name: "Portfolio", href: "/", target: "" },
  { name: "Pools", href: "/pools", target: "" },
  {
    name: "Blog & Research",
    href: meta.DOCS,
    target: "_blank"
  }
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

export const SUPPORTED_TOKENS = [
  {
    token: "WETH",
    address: "0x212cfa035c6707331adeDe61c35d4E0C9e0b4007",
    logo: "/tokens/weth.svg"
  },
  {
    token: "WBTC",
    address: "",
    logo: "/tokens/wbtc.svg"
  },
  {
    token: "USDC",
    address: "",
    logo: "/tokens/usdc.svg"
  }
];

export const TOKENS: {
  [key: string]: `0x${string}`
} = {
  WETH: "0x212cfa035c6707331adeDe61c35d4E0C9e0b4007" as Address
}

export const CONTRACT_ADDRESSES = {
  POTENTIA_FACTORY_ADDR: "0xB7CEb18E71291A03810D589851066A7eA0E87C2F" as Address,
  WETH_ADDR: "0x212cfa035c6707331adeDe61c35d4E0C9e0b4007" as Address,
  WETH_POOL_ADDR: "0xe6b3e196bdfA012B20B5EdA6dB9396a61963C117" as Address,
  PTOKEN_ADDR: "0x56169607c23501d4ad5ffd16a5a164d007de57f8" as Address,
  WBTC_ADDR: "0xa74ca0170ad066881d6413e3cef5a2dbafde5bdf" as Address,
  WBTC_POOL_ADDR: "0x73d705ff0fc884315a61afd3fde3646fb0a949e6" as Address,
  USDC_ADDR: "0xEA5f22bc4A620b01D48e74B6B69e74F3b2299654" as Address,
  USDC_POOL: "0x390e5b479b9c743f933a4fe50cd0a4fae742fdb0" as Address
};
