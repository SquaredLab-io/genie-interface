"use client";

import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { z } from "zod";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";

export default function TestNew() {
  const isClient = useIsClient();
  const { isConnected } = useAccount();

  // Validation Schema
  const isString = z.string();
  const isUndefined = z.undefined();

  const { address } = useAccount();

  const { success, data, error } = isString.safeParse(1e4);

  // const { pools, isFetching } = usePools();
  // const { selectedPool } = usePoolsStore();
  const [value, setValue] = useState("");

  if (!isClient) {
    return (
      <main className="page-center items-center justify-center">
        <span>mounting...</span>
      </main>
    );
  }

  return (
    <main className="flex-col-center gap-3">
      <span>{isConnected ? "Connected" : "Not Connected"}</span>
      {/* <span>{isFetching && !pools ? "fetching..." : "fetched"}</span> */}
      {/* {<span>Selected Pool: {selectedPool()?.pool}</span>} */}
      <span>
        Account is {isUndefined.safeParse(address).success ? "undefined" : address}
      </span>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="enter positive numbers"
      />
      <span>Number is positive: {`${isValidPositiveNumber(value)}`}</span>
    </main>
  );
}
