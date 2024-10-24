import { memo, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import { useModalStore } from "@store/poolsStore";
import { LpTradeOptions } from "@lib/types/enums";
import { useLpStore } from "@store/lpStore";

const PoolMenu = ({
  underlying,
  power,
  children
}: {
  underlying: string;
  power: number;
  children: ReactNode;
}) => {
  const { setLpTradeOption } = useLpStore();
  const { setOpenManageModal } = useModalStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 text-white p-4 bg-[#0D1921] border-secondary-gray">
        <DropdownMenuLabel className="p-0 mb-2">Actions</DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="p-0 mb-4 focus:bg-[#0D1921]">
          <Link
            className="pool-menu-button"
            href={{
              pathname: `/pool/${underlying}`,
              query: { power: power }
            }}
            as={`/pool/${underlying}?power=${power}`}
            onClick={() => {
              setLpTradeOption(LpTradeOptions.withdraw);
            }}
          >
            <Image
              src="/icons/MinusIcon.svg"
              width={14}
              height={14}
              alt="Withdraw Liquidity"
            />
            <span>Withdraw</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 mb-4 focus:bg-[#0D1921]">
          <button
            className="pool-menu-button"
            onClick={() => {
              setOpenManageModal(true);
            }}
            disabled={true}
          >
            <Image src="/icons/TradeIcon.svg" width={16} height={16} alt="Manage Pool" />
            <span>Manage Pool</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 focus:bg-[#0D1921]">
          <Link
            className="pool-menu-button"
            href={{
              pathname: `/pool/burn`,
              query: { power }
            }}
            as={`/pool/burn/${underlying}?power=${power}`}
          >
            <Image src="/icons/FireIcon.svg" width={16} height={16} alt="Burn NFT" />
            <span className="text-[#FF615C]">Burn NFT</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(PoolMenu);
