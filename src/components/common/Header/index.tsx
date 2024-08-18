"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";
import { meta, navigation } from "@lib/constants";
import FeedbackModal from "./feedback-modal";
import ConnectWallet from "../ConnectWallet";
// import { CoinbaseCreateWallet } from "../ConnectWallet/CoinbaseCreateWallet";
import NextImage from "../NextImage";
import FaucetModal from "@components/common/Header/faucet-modal";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);

  return (
    <header className="flex flex-row py-4 px-5 justify-between font-sans-ibm-plex">
      <nav className="flex justify-start items-center gap-12" aria-label="Global">
        {/* Brand Logo */}
        <Link href="/" className="-m-1.5 p-1.5 max-w-fit">
          <span className="sr-only">Genie | SquaredLabs</span>
          <Image
            src="/images/logo-wide.svg"
            alt={`${meta.APP_NAME} logo`}
            width={116.37}
            height={42.46}
            priority
          />
        </Link>
        <div className="hidden sm:flex gap-x-6 lg:gap-x-11 font-medium text-[14px]/[22px] uppercase">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.target}
              className={cn(
                pathname !== item.href && "opacity-35 hover:opacity-90 transition-opacity"
              )}
              aria-label={item.name}
            >
              {item.name}
            </Link>
          ))}
          <button
            className={cn(
              "max-w-fit uppercase",
              !isModalOpen && "opacity-35 hover:opacity-90 transition-opacity"
            )}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Feedback & Support
          </button>
          <button
            className={cn(
              "max-w-fit uppercase",
              !isFaucetOpen && "opacity-35 hover:opacity-90 transition-opacity"
            )}
            onClick={() => {
              setIsFaucetOpen(true);
            }}
          >
            Faucet
          </button>
        </div>
      </nav>
      <div className="inline-flex gap-6">
        {/* <button variant={"secondary"} onClick={() => setIsFaucetOpen(true)}>
        className="max-w-fit hover:underline underline-offset-2"
        </button> */}
        {/* <CoinbaseCreateWallet /> */}
        <ConnectWallet />
      </div>
      {isFaucetOpen && <FaucetModal open={isFaucetOpen} setOpen={setIsFaucetOpen} />}
      {isModalOpen && <FeedbackModal open={isModalOpen} setOpen={setIsModalOpen} />}
    </header>
  );
};

export default memo(Header);
