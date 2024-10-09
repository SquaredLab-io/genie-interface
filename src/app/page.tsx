"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useWindowSize } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import Loading from "./loading";
import MobileInfoScreen from "@components/common/MobileInfoScreen";
import NotFoundCommon from "@components/common/not-found-common";

const Trade = dynamic(() => import("@components/Trade").then((mod) => mod.default));

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  const { width } = useWindowSize();
  const { pools, isFetching, status } = usePools();

  const TradeInterface = () => {
    if ((isFetching && status === "pending") || width === 0) return <Loading />;
    else if (status === "success" && pools?.length === 0) {
      return (
        <NotFoundCommon
          title="404 Pools not found"
          subText="Sorry, but unable to find any pools."
        />
      );
    }
    return (
      <main className="page-center">
        <Trade />
      </main>
    );
  };

  const render = useMemo(() => {
    return width <= 1024 ? MobileInfoScreen : <TradeInterface />;
  }, [width, isFetching, status, pools]);

  return render;
}
