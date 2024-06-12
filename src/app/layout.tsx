import clsx from "clsx";
import "./globals.css";
import { manrope, ibm_plex_sans } from "@lib/fonts";
import Header from "@components/common/Header";
import { Metadata } from "next";
import { meta } from "@lib/constants";

const { APP_NAME, DESCRIPTION, KEYWORDS, URL, IMAGE, SITE_NAME, USERNAME } = meta;

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME
  },
  description: "Derivatives without liquidation.",
  icons: {
    icon: "/images/logo.svg",
    apple: "apple-touch-icon-precomposed"
  },
  keywords: KEYWORDS,
  applicationName: APP_NAME,
  referrer: "origin-when-cross-origin",
  publisher: "SquaredLabs",
  openGraph: {
    title: APP_NAME,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "https://frontend-web-resources.s3.amazonaws.com/og-small.png",
        width: 800,
        height: 600
      },
      {
        url: "https://frontend-web-resources.s3.amazonaws.com/og-large.png",
        width: 1800,
        height: 1600,
        alt: "SquaredLabs"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      nocache: true
    }
  },
  twitter: {
    title: "SquaredLabs",
    description: "Derivatives without liquidation.",
    images: [IMAGE],
    card: "summary_large_image",
    creator: USERNAME
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(manrope.variable, ibm_plex_sans.variable)}>
      <body className="w-full font-sans-ibm-plex">
        <Header />
        {children}
      </body>
    </html>
  );
}
