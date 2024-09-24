import { memo, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import { useModalStore } from "@store/poolsStore";

const PoolMenu = ({
  underlying,
  power,
  children
}: {
  underlying: string;
  power: number;
  children: ReactNode;
}) => {
  const { setOpenManageModal } = useModalStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 text-white p-4 bg-[#0D1921] border-secondary-gray">
        <DropdownMenuLabel className="p-0 mb-2">Actions</DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="p-0 mb-4 focus:bg-[#0D1921]">
          <Link
            className="inline-flex gap-2 items-center w-full"
            href={{
              pathname: `/pool/${underlying}`,
              query: { power: power }
            }}
            as={`/pool/${underlying}?power=${power}`}
          >
            <Image src="/icons/MinusIcon.svg" width={14} height={14} alt="add icon" />
            <span>Withdraw</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 focus:bg-[#0D1921]">
          <div
            className="inline-flex gap-2 items-center w-full cursor-pointer"
            onClick={() => {
              setOpenManageModal(true);
            }}
          >
            <Image src="/icons/TradeIcon.svg" width={16} height={16} alt="trade icon" />
            <span>Manage Pool</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(PoolMenu);
