"use client";

import notification from "@components/common/notification";
import { useAccount } from "wagmi";
import { useLocalStorage, useIsClient } from "usehooks-ts";
import { Button } from "@components/ui/button";

export default function TestNew() {
  const isClient = useIsClient();

  const { address } = useAccount();

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  return (
    <main className="flex-col-center gap-3">
      <p>{!address && "Connect wallet first!"}</p>
    </main>
  );
}
