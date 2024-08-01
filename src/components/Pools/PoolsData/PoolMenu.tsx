/**
 * Status: Deprecated
 */

import Link from "next/link";
import Image from "next/image";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import { Pool } from "@lib/types/common";
import { useRouter } from "next/navigation";

const PoolMenu = ({ pool }: { pool: Pool }) => {
  const router = useRouter();

  const { underlyingTokens, power } = pool;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiEllipsisHorizontal size={32} color="#6D6D6D" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 text-white">
        <DropdownMenuLabel>
          <>
            {underlyingTokens.map((asset, index) => (
              <span key={index} className="font-bold text-sm/5">
                {asset.symbol}
                {underlyingTokens.length !== index + 1 && <span className="mx-1">/</span>}
              </span>
            ))}
            <span className="font-bold text-xs/5 bg-[#22C9FF24] text-[#0091FF] px-2 rounded-lg">
              p = {power}
            </span>
          </>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const symbol = pool.underlyingTokens[0].symbol;
            // TODO: Update this with original pool later
            router.push(`/pool/${symbol}`);
          }}
        >
          <Link className="inline-flex gap-2 items-center w-full" href="/pool">
            <Image src="/icons/StatsIcon.svg" width={16} height={16} alt="stats icon" />
            <span>View Stats</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const symbol = pool.underlyingTokens[0].symbol;
          }}
        >
          <Link className="inline-flex gap-2 items-center w-full" href="/pool">
            <Image src="/icons/PlusIcon.svg" width={16} height={16} alt="add icon" />
            <span>Add Liquidity</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="inline-flex gap-2 items-center w-full" href="/">
            <Image src="/icons/TradeIcon.svg" width={16} height={16} alt="trade icon" />
            <span>Trade</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PoolMenu;
