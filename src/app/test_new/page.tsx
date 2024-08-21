"use client";

import { useAccount } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import { usePoolsStore } from "@store/poolsStore";
import { z } from "zod";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { useToast } from "@components/ui/use-toast";
import { Button } from "@components/ui/button";

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

  const { toast } = useToast();

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
      <Button
        variant={"default"}
        onClick={() => {
          toast({
            title: "Open transaction successful",
            description: "Kudos, you're a champ!",
            duration: 4000,
          });
        }}
      >
        Show Toast
      </Button>
    </main>
  );
}
