"use client";

import Hero from "@components/Pools/Hero";
import PoolsData from "@components/Pools/PoolsData";

export default function Pools() {
  return (
    <main className="px-16 lg:px-[90px] py-20 overflow-hidden">
      <Hero />
      <PoolsData />
    </main>
  );
}
