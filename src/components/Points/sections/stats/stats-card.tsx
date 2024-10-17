import { FC, memo } from "react";
import Image from "next/image";
import { cn } from "@lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  textStyle?: string;
}

const StatsCard: FC<StatsCardProps> = ({
  label,
  value,
  icon,
  textStyle = "text-white"
}) => {
  return (
    <div className="col-span-1 min-w-[230px] w-fit rounded-lg flex flex-col gap-y-2 p-4 items-start bg-[#14252E] hover:bg-[#142F41] transition-colors duration-200 ease-in">
      <Image src={icon} height={40} width={40} alt={label} />
      <h3 className="font-normal text-base/[14.5px] text-[#858D92]">{label}</h3>
      <h1 className={cn("font-medium text-xl/6", textStyle)}>{value}</h1>
    </div>
  );
};

export default memo(StatsCard);
