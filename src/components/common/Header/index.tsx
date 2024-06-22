"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { navigation } from "@lib/constants";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import ConnectWallet from "../ConnectWallet";
import FeedbackModal from "../feedback-modal";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <header>
      <nav
        className="mx-auto flex bg-primary-gray justify-start items-center gap-x-12 py-3 px-4"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 max-w-fit">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Genie | SquaredLabs</span>
            <Image
              width={32}
              height={32}
              className="h-8 w-auto"
              src="/images/logo_text.svg"
              alt="squaredlabs logo"
            />
          </Link>
        </div>
        <div className="hidden sm:flex lg:gap-x-4 font-normal text-[13px]/[17.76px]">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.target}
              className={clsx(
                "px-[10px]",
                pathname !== item.href && "opacity-35 hover:opacity-70 transition-opacity"
              )}
              aria-label={item.name}
            >
              {item.name}
            </Link>
          ))}
          <button
            className={clsx("px-[10px] opacity-35 hover:opacity-70 transition-opacity")}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Feedback & Support
          </button>
        </div>
        <ConnectWallet />
      </nav>
      <FeedbackModal open={isModalOpen} setOpen={setIsModalOpen} />
    </header>
  );
};

export default memo(Header);
