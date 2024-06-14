"use client";

import Image from "next/image";
import { navigation } from "@lib/constants";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();

  return (
    <header>
      <nav
        className="mx-auto flex bg-primary-gray mb-1 items-center gap-x-12 py-3 px-4"
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
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                "px-[10px]",
                pathname !== item.href && "opacity-35 hover:opacity-70 transition-opacity"
              )}
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
