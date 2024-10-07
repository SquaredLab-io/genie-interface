"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";
import { meta, navigation } from "@lib/constants";
import FeedbackModal from "./feedback-modal";
import ConnectWallet from "../ConnectWallet";
import FaucetModal from "@components/common/Header/faucet-modal";
import PointsPopover from "./points-popover";
import { useAccount } from "wagmi";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);

  const { isConnected } = useAccount();

  return (
    <header className="flex flex-row flex-grow py-4 px-5 justify-between font-sans-ibm-plex max-w-full">
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
        <div className="hidden lg:flex gap-x-6 lg:gap-x-11 font-medium text-[14px]/[22px] 2xl:text-[14px]/[22px] 3xl:text-[15.75px] uppercase">
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
      <div className="hidden lg:inline-flex gap-6">
        {isConnected && (
          <PointsPopover>
            <button className="inline-flex items-center gap-x-1 text-sm max-w-fit px-2 -mx-2 select-none hover:scale-105 active:scale-95 transition-transform duration-200">
              <Image
                src="/icons/PointsIcon.svg"
                alt="Genie Points | GPoints"
                height={24}
                width={24}
              />
              <span className="font-normal leading-5 ml-1">25 Gpoints</span>
              <span className="font-medium leading-4 font-sans-ibm-plex text-primary-green bg-primary-green/10 py-0.5 px-1 rounded-base">
                1.5x
              </span>
            </button>
          </PointsPopover>
        )}
        <ConnectWallet />
      </div>
      {isFaucetOpen && <FaucetModal open={isFaucetOpen} setOpen={setIsFaucetOpen} />}
      {isModalOpen && <FeedbackModal open={isModalOpen} setOpen={setIsModalOpen} />}
    </header>
  );
};

export default memo(Header);
