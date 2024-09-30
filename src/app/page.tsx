"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useWindowSize } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import Loading from "./loading";
import MobileInfoScreen from "@components/common/MobileInfoScreen";

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
        <main className="page-center items-center justify-center text-3xl">
          404: Pools not found
        </main>
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

/*
   else if (status === "error") {
     return (
       <main className="page-center flex flex-col items-center justify-center">
         <h2 className="text-4xl tracking-wide mb-10">Something went wrong!</h2>
         <Button onClick={() => router.refresh()} variant={"secondary"}>
           Try again
         </Button>
       </main>
     );
   }
 */
