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
  USERNAME: "@squaredlabs_"
};

//
// Header navigation links
//
export const navigation: {
  name: string;
  href: string;
  target: string;
}[] = [
  { name: "Portfolio", href: "/", target: "" },
  { name: "Pools", href: "/pools", target: "" },
  {
    name: "Blog & Research",
    href: "https://squaredlabs-io.gitbook.io/squaredlabs.io",
    target: "_blank"
  },
  { name: "Feedback & Support", href: "/feedback", target: "" }
];
