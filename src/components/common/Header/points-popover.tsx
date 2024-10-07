import { FC, memo, PropsWithChildren, ReactNode, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";

const PointsPopover: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild className="min-w-fit z-50">
        {children}
      </PopoverTrigger>
      <PopoverContent side="top" className="bg-[#071A26] border-none rounded-base p-0">
        <h1 className="py-4 pl-4 w-full font-medium text-base/5">Your Gpoints</h1>
        <Separator />
        <div className="px-4 pt-3 pb-4 flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between font-normal text-base/5 text-[#E6E6E6]">
            <div className="flex flex-col items-start gap-2">
              <p className="inline-flex gap-x-1 font-light text-[13px]/4 text-[#ADB2AB]">
                <Image
                  src="/icons/PointsIcon.svg"
                  alt="Genie Points | GPoints"
                  height={16}
                  width={16}
                />
                <span>Points</span>
              </p>
              <span>4214</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-light text-[13px]/4 text-[#ADB2AB]">Rank</span>
              <span>47434</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-light text-[13px]/4 text-[#ADB2AB]">Multiplier</span>
              <span>NA</span>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <Link href="/" target="_blank" className="inline-flex items-center">
              <span className="font-light text-xs/4 text-[#ADB2AB]">How it works</span>
              <ArrowUpRight size={12} className="ml-1" stroke="#ADB2AB" />
            </Link>
            <Link href="/leaderboard" onClick={() => setIsOpen(false)}>
              <button className="w-full border-[0.5px] inline-flex items-center justify-center gap-x-1 border-[#D9D9D9] hover:bg-[#D9D9D9]/5 transition-colors duration-300 py-3">
                <Trophy size={16} stroke="#C1C1C1" />
                <span className="font-normal text-sm/6 text-[#C1C1C1]">Leaderboard</span>
              </button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(PointsPopover);
