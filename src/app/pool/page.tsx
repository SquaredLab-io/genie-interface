"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PoolOverviewPage() {
  const router = useRouter();

  // forward to weth page as default
  useEffect(() => router.push("/pool/weth?power=2"), []);

  return <main></main>;
}
