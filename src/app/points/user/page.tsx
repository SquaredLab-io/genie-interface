"use client";

import { useSearchParams } from "next/navigation";
import { Address } from "viem";
import UserPoints from "@components/Points/user-points";
import Hero from "@components/Points/user-points/hero";

export default function UserStats() {
  const queryParams = useSearchParams();
  const userAddr = queryParams.get("address") ?? undefined;

  return (
    <main className="pl-[88px] pr-[84px] pt-16 pb-10 overflow-hidden">
      <Hero address={userAddr as Address} />
      <UserPoints address={userAddr as Address} />
    </main>
  );
}
