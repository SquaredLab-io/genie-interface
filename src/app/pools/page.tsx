"use client";

import MobileInfoScreen from "@components/common/MobileInfoScreen";
import Hero from "@components/Pools/Hero";
import PoolsData from "@components/Pools/PoolsData";
import { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";

export default function Pools() {
  const { width } = useWindowSize();

  const PoolsContent = () => (
    <main className="px-16 lg:px-[90px] py-20 overflow-hidden">
      <Hero />
      <PoolsData />
    </main>
  );

  const render = useMemo(() => {
    return width <= 1024 ? MobileInfoScreen : <PoolsContent />;
  }, [width]);

  return render;
}
