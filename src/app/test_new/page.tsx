"use client";

import { Button } from "@components/ui/button";
import { useIsMounted } from "@lib/hooks/useIsMounted";
import notification from "@components/common/notification";
import { useAccount } from "wagmi";

export default function TestNew() {
  const { isMounted } = useIsMounted();
  const { address } = useAccount();

  if (!isMounted) {
    return <></>;
  }

  return (
    <main className="flex-col-center gap-3">
      <p>{!address && "Connect wallet first!"}</p>
      <Button
        variant={"default"}
        onClick={() => {
          notification.success({
            title: "Order placed successfully",
            description: "This is a successful transaction!",
            duration: 2000
          });
        }}
        className="bg-green-400 text-black"
      >
        Success
      </Button>
      <Button
        variant={"default"}
        onClick={() => {
          notification.info({
            title: "Order placed successfully",
            description: "This is a successful transaction!",
            duration: 2000,
          });
        }}
        className="bg-yellow-400 text-black"
      >
        Info
      </Button>
      <Button
        variant={"default"}
        onClick={() => {
          notification.success({
            title: "Order placed successfully",
            description: "This is a successful transaction!",
            duration: 2000
          });
        }}
        className="bg-red-400 text-black"
      >
        Error
      </Button>
    </main>
  );
}
