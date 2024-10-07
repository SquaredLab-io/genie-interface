"use client";

import { useAccount } from "wagmi";
import _useTokenBalance from "@lib/hooks/useTokenBalance";
import { _getDecimalAdjusted } from "@lib/utils/formatting";

export default function Leaderboard() {
  const { isConnected, address } = useAccount();

  return <main></main>;
}
