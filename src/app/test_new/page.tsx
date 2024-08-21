"use client";

import { useIsClient } from "usehooks-ts";
import { useState } from "react";

export default function TestNew() {
  const isClient = useIsClient();
  const [isloading, setIsloading] = useState(false);

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  return (
    <main className="flex-col-center gap-3">
      {/* <span>{isFetching && !pools ? "fetching..." : "fetched"}</span> */}
      {/* {<span>Selected Pool: {selectedPool()?.pool}</span>} */}
      <span>Loading: {isloading ? "true" : "false"}</span>
    </main>
  );
}
