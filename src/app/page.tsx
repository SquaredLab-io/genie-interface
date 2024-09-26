"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { usePools } from "@lib/hooks/usePools";
import Loading from "./loading";
// import { Button } from "@components/ui/button";

// Trade Interface imported dynamically
const Trade = dynamic(() => import("@components/Trade").then((mod) => mod.default));

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  const { pools, isFetching, status } = usePools();
  const router = useRouter();

  if (isFetching && status === "pending") return <Loading />;
  // else if (status === "error") {
  //   return (
  //     <main className="page-center flex flex-col items-center justify-center">
  //       <h2 className="text-4xl tracking-wide mb-10">Something went wrong!</h2>
  //       <Button onClick={() => router.refresh()} variant={"secondary"}>
  //         Try again
  //       </Button>
  //     </main>
  //   );
  // }
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
}
