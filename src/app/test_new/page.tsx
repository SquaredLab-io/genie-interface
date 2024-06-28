"use client";

import { Button } from "@components/ui/button";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import { useAccount } from "wagmi";

export default function TestNew() {
  const { isMounted } = useIsMounted();
  const { address } = useAccount();

  if (!isMounted) {
    return <></>;
  }

  return (
    <div>
      {address && <Button onClick={() => {}}>{"Get Long Positions"}</Button>}
      <p>{!address && "Connect wallet first!"}</p>
    </div>
  );
}
