import { IconType } from "react-icons";
import { FaTelegramPlane } from "react-icons/fa";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";

// App State
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "production";

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
  DOCS: "https://squaredlabs-io.gitbook.io/squaredlabs.io"
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

// Pools page header social links
export const pools_social: {
  name: string;
  href: string;
  target: string;
  icon: IconType;
}[] = [
  {
    name: "twitter",
    href: meta.TWITTER,
    icon: FaXTwitter,
    target: "_blank"
  },
  {
    name: "discord",
    href: meta.DISCORD,
    icon: FaDiscord,
    target: "_blank"
  },
  {
    name: "telegram",
    href: meta.TELEGRAM,
    icon: FaTelegramPlane,
    target: "_blank"
  }
];
