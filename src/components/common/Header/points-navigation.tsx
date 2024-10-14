"use client";

import { useUserPoints } from "@lib/hooks/useUserPoints";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import PointsPopover from "./points-popover";
import Image from "next/image";

const PointsNavigation = () => {
  const [isPointsPopoverOpen, setIsPointsPopoverOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { userPoints, isFetching, isPending, refetch } = useUserPoints({
    address
  });

  const displayPoints = useMemo(() => {
    if (!userPoints && (isFetching || isPending)) {
      return "...";
    }
    return userPoints?.points ?? "NA";
  }, [userPoints, isFetching, isPending]);

  return isConnected ? (
    <PointsPopover
      points={{ userPoints, isFetching, isPending, refetch }}
      isOpen={isPointsPopoverOpen}
      onOpenChange={setIsPointsPopoverOpen}
    >
      <button
        className="inline-flex items-center gap-x-1 text-sm max-w-fit px-2 -mx-2 select-none hover:scale-105 active:scale-95 transition-transform duration-200"
        onMouseEnter={() => setIsPointsPopoverOpen(true)}
        // onMouseLeave={() => setIsPointsPopoverOpen(false)}
      >
        <Image
          src="/icons/PointsIcon.svg"
          alt="Genie Points | GPoints"
          height={24}
          width={24}
        />
        <span className="font-normal leading-5 ml-1">{displayPoints} Gpoints</span>
        {/* <span className="font-medium leading-4 font-sans-ibm-plex text-primary-green bg-primary-green/10 py-0.5 px-1 rounded-base">
                1.5x
              </span> */}
      </button>
    </PointsPopover>
  ) : (
    <></>
  );
};

export default PointsNavigation;
