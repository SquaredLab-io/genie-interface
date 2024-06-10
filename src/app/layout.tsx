import type { Metadata } from "next";
import "./globals.css";
import { manrope, ibm_plex_sans } from "@utils/fonts";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Genie | SquaredLabs",
  description:
    "Genie is an entire derivatives ecosystem without liquidation! Powered by Potentia Protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(manrope.variable, ibm_plex_sans.variable)}>
      <body className="font-sans-ibm-plex">{children}</body>
    </html>
  );
}
