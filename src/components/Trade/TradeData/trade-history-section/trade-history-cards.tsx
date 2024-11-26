import Image from "next/image";
import { useAccount } from "wagmi";
import { Tx } from "@squaredlab-io/sdk";
import NextImage from "@components/common/NextImage";
import { BASE_SEPOLIA } from "@lib/constants";
import { useTokenPrice } from "@lib/hooks/useTokenPrice";
import { cn } from "@lib/utils";
import { formatLimit, formatNumber, getDecimalAdjusted } from "@lib/utils/formatting";
import { usePoolsStore } from "@store/poolsStore";

interface PropsType {
  data: Tx[];
  isLoading: boolean;
}

const HistoryCard = ({ data }: { data: Tx }) => {
  const { poolMap } = usePoolsStore();

  const { action, oraclePrice, underlying, size, poolAddress } = data;
  const poolData = poolMap?.[poolAddress];
  const assets = [poolData?.underlying, "USDC"];

  const side = action === "CL" ? "Long" : "Short";

  // Size
  const { tokenPrices, isFetching } = useTokenPrice({
    poolAddress
  });
  const tradePrice = tokenPrices
    ? parseFloat(side === "Long" ? tokenPrices.lastLongP : tokenPrices.lastShortP)
    : undefined;
  return (
    <div className="p-3 flex flex-col gap-5 border border-secondary-gray rounded-lg">
      {/* Title */}
      <div className="flex flex-row gap-2 text-left font-medium">
        <div className="flex flex-row items-center max-w-fit -space-x-2">
          {assets?.map((asset) => (
            <div
              key={asset}
              className="z-0 flex overflow-hidden ring-1 ring-white rounded-full bg-neutral-800"
            >
              <Image
                src={`/tokens/${asset?.toLowerCase()}.svg`}
                alt={`${asset} icon`}
                width={26}
                height={26}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <div className="inline-flex gap-2">
            <p className="font-bold text-sm/5">
              {assets?.map((asset, index) => (
                <>
                  <span key={index}>{asset}</span>
                  {assets.length !== index + 1 && (
                    <span className="text-[#9299AA] mx-1">/</span>
                  )}
                </>
              ))}
            </p>
            <p className="text-nowrap font-normal text-xs/[14px] bg-gradient-cyan py-[2px] px-1 rounded-sm opacity-90">
              p = {poolData?.power}
            </p>
          </div>
          <div className="font-normal text-sm/5 text-[#9299AA]">
            <p>
              {BASE_SEPOLIA.PROTOCOL} • {BASE_SEPOLIA.NAME}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        {/* Position type */}
        <div className="flex flex-col items-start gap-4">
          <h4 className="font-bold text-sm/[18px] text-[#5F7183]">Side</h4>
          <span
            className={cn(
              "font-normal text-sm/4",
              side === "Long"
                ? "text-[#0AFC5C]"
                : side === "Short"
                  ? "text-[#FF3318]"
                  : ""
            )}
          >
            {side as string}
          </span>
        </div>
        {/* Token Size */}
        <div className="flex flex-col items-start gap-2">
          <h4 className="font-bold text-sm/[18px] text-[#5F7183]">Size</h4>
          <p className="flex flex-col items-start gap-[2px]">
            <span className="font-normal text-sm/4">{formatNumber(size.value)}</span>
            <span className="text-[#9299AA] font-normal text-xs/4">
              {isFetching && !sizeInDollars
                ? "..."
                : formatNumber(sizeInDollars.value, true)}
            </span>
          </p>
        </div>
        {/* PNL */}
        <div className="flex flex-col items-start gap-2">
          <h4 className="font-bold text-sm/[18px] text-[#5F7183]">P&L</h4>
          <p className="flex flex-col gap-[2px] items-start">
            <span
              className={cn(
                "font-normal text-sm/4",
                pAndLPercent.value == 0
                  ? "text-gray-200"
                  : pAndLPercent.value > 0
                    ? "text-[#0AFC5C]"
                    : "text-[#FF3318]"
              )}
            >
              {formatNumber(pAndLAmt.value, true)}
            </span>
            <span
              className={cn(
                "font-normal text-xs/4",
                pAndLPercent.sign ? "text-[#07AE3B]" : "text-[#F23645]"
              )}
            >
              {formatNumber(pAndLPercent.value)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const TradeHistoryCards = ({ data, isLoading }: PropsType) => {
  const { isConnected } = useAccount();
  const {} = data;

  if (!isConnected) {
    return (
      <div className="min-h-full w-full p-3 text-center">
        <span className="font-normal text-base/7 text-[#B5B5B5]">
          Connect Wallet to view your transactions.
        </span>
      </div>
    );
  } else if (data.length === 0)
    return (
      <div className="w-full p-3 flex flex-col gap-2 text-center">
        <NextImage
          src="/icons/file-icon.svg"
          className="size-[62px]"
          altText="file icon"
        />
        <span className="text-[#B0B3B8] font-normal text-sm/6">
          {isLoading ? "Fetching your Positions..." : "No Close Positions."}
        </span>
      </div>
    );

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-y-4 p-3",
        isLoading && "items-center justify-center pt-10"
      )}
    >
      {data.map((position) => (
        <PositionCard key={position.pool} data={position} />
      ))}
    </div>
  );
};

export default TradeHistoryCards;
