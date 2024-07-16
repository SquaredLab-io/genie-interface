"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navigation } from "@lib/constants";
import FeedbackModal from "./feedback-modal";
import ConnectWallet from "../ConnectWallet";
// import { CoinbaseCreateWallet } from "../ConnectWallet/CoinbaseCreateWallet";
import NextImage from "../NextImage";
// import { Button } from "@components/ui/button";
import FaucetModal from "@components/common/Header/faucet-modal";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);

  return (
    <header className="flex flex-row py-4 px-5 justify-between font-sans-ibm-plex">
      <nav className="flex justify-start items-center gap-x-[60px]" aria-label="Global">
        {/* Brand Logo */}
        <div className="flex lg:flex-1 max-w-fit">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Genie | SquaredLabs</span>
            <NextImage
              src="/images/logo_text.svg"
              altText="genie logo"
              className="w-[72px]"
            />
          </Link>
        </div>
        <div className="hidden sm:flex gap-x-6 lg:gap-x-11 font-medium text-[14px]/[22px] uppercase">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.target}
              className={clsx(
                pathname !== item.href && "opacity-35 hover:opacity-70 transition-opacity"
              )}
              aria-label={item.name}
            >
              {item.name}
            </Link>
          ))}
          <button
            className={clsx("opacity-35 hover:opacity-70 transition-opacity uppercase")}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Feedback & Support
          </button>
        </div>
      </nav>
      <div className="inline-flex gap-6">
        {/* <Button variant={"secondary"} onClick={() => setIsFaucetOpen(true)}>
          Faucet
        </Button> */}
        {/* <CoinbaseCreateWallet /> */}
        <ConnectWallet />
      </div>
      <FaucetModal open={isFaucetOpen} setOpen={setIsFaucetOpen} />
      <FeedbackModal open={isModalOpen} setOpen={setIsModalOpen} />
    </header>
  );
};

export default memo(Header);
