import { Metadata } from "next";
import { ibm_plex_sans, helvetica_neue, manrope } from "@lib/fonts";
import { cn } from "@lib/utils";
import Header from "@components/common/Header";
import { meta } from "@lib/constants";
import Providers from "@components/common/providers";
import { Toaster as SonnerToaster } from "@components/ui/sonner";
import { Toaster } from "@components/ui/toaster";
import "./globals.css";

const { APP_NAME, DESCRIPTION, KEYWORDS, URL, LOGO, IMAGE, SITE_NAME, USERNAME } = meta;

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME
  },
  description: "Derivatives without liquidation",
  icons: {
    icon: LOGO,
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
    <html lang="en">
      <body
        className={cn(ibm_plex_sans.variable, helvetica_neue.variable, manrope.variable)}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
        <Toaster />
        <SonnerToaster
          position="bottom-right"
          expand
          visibleToasts={4}
          offset={"28px"}
          toastOptions={{
            unstyled: true,
            className: "min-w-[345px] rounded-sm backdrop-blur-md bg-[#161A1C17]/5"
          }}
        />
      </body>
    </html>
  );
}
