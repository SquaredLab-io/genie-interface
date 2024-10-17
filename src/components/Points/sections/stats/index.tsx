import { useAccount } from "wagmi";
import StatsCard from "./stats-card";
import { UserPointsType, useUserPoints } from "@lib/hooks/useUserPoints";
import { formatTradeValue } from "../helper";
import ConnectWallet from "@components/common/ConnectWallet";
import { RewardHistoryType, useRewardHistory } from "@lib/hooks/useRewardHistory";

const Stats = () => {
  const { isConnected, address } = useAccount();

  const points = useUserPoints({
    address
  });
  const rewards = useRewardHistory({ address });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center w-full text-center gap-5 py-20">
        <span className="font-normal text-base/7 text-[#B5B5B5]">
          Connect Wallet to view your Genie Stats.
        </span>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col gap-y-14">
      <GpointsAndReferals points={points} />
      <UserActivity points={points} rewards={rewards} />
      {/* <RewardHistory /> */}
    </div>
  );
};

const GpointsAndReferals = ({ points }: { points: UserPointsType }) => {
  const { userPointsData, isFetching, isPending } = points;
  const userRank = userPointsData?.userPoints;
  const loading = isPending || isFetching;
  return (
    <div className="flex flex-col gap-y-10 mt-10">
      <div className="flex flex-col gap-y-2 items-start">
        <h1 className="font-medium text-2xl/9">
          <span className="heading-gradient">Gpoints</span>
          {/* And Referals */}
        </h1>
        <p className="font-normal text-base/[22px] text-[#98B0C1]">
          Use Genie To Earn GPoints
          {/* Use Genie And Invite Friends To Earn GPoints */}
        </p>
      </div>
      {/* Gpoints and Referals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Gpoints"
          value={loading ? "..." : userRank ? userRank.points.toString()! : "NA"}
          icon="/icons/PointsIcon.svg"
        />
        <StatsCard
          label="Your Rank"
          value={loading ? "..." : userRank ? userRank.rank.toString()! : "NA"}
          icon="/icons/RankIcon.svg"
        />
        {/* <StatsCard label="Total Referrals" value="2" icon="/icons/ReferralIcon.svg" /> */}
      </div>
    </div>
  );
};

const UserActivity = ({
  points,
  rewards
}: {
  points: UserPointsType;
  rewards: RewardHistoryType;
}) => {
  const { userPointsData, isFetching, isPending } = points;
  const { rewardHistory, isFetching: isRFetching, isPending: isRPending } = rewards;

  const userRank = userPointsData?.userPoints;
  const avgTradeSize = userPointsData?.avgTradeSize;
  return (
    <div className="flex flex-col gap-y-10 mt-10">
      <div className="flex flex-col gap-y-2 items-start">
        <h1 className="font-medium text-2xl/9">
          <span className="heading-gradient">Your</span> Activity
        </h1>
        <p className="font-normal text-base/[22px] text-[#98B0C1]">
          Your adventures on Genie are summarised here
        </p>
      </div>
      {/* Gpoints and Referals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Volume Traded"
          value={formatTradeValue(isFetching || isPending, userRank?.volume)}
          icon="/icons/VolumeIcon.svg"
        />
        <StatsCard
          label="Total Profit/loss"
          value={formatTradeValue(isFetching || isPending, userRank?.profit)}
          icon="/icons/PnlIcon.svg"
        />
        <StatsCard
          label="Avg Trade Size"
          value={formatTradeValue(
            isFetching || isPending,
            (avgTradeSize ?? 0)?.toString()
          )}
          icon="/icons/TradeSizeIcon.svg"
        />
        <StatsCard
          label="Best Trade"
          value={formatTradeValue(
            isRFetching || isRPending,
            (rewardHistory?.max ?? 0).toString()
          )}
          icon="/icons/CheckCircleIcon.svg"
        />
        <StatsCard
          label="Worst Trade"
          value={formatTradeValue(
            isRFetching || isRPending,
            (rewardHistory?.min ?? 0).toString()
          )}
          icon="/icons/WorstIcon.svg"
        />
      </div>
    </div>
  );
};

// No Data
const RewardHistory = () => (
  <div className="flex flex-col gap-y-10 mt-10">
    <div className="flex flex-col gap-y-2 items-start">
      <h1 className="font-medium text-2xl/9">
        <span className="heading-gradient">Reward</span> History
      </h1>
      <p className="font-normal text-base/[22px] text-[#98B0C1]">
        The real reason you earn the Gpoints
      </p>
    </div>
    {/* Gpoints and Referals Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <StatsCard label="Total Gpoints" value="-" icon="/icons/PointsIcon.svg" />
      <StatsCard label="Your Rank" value="-" icon="/icons/RankIcon.svg" />
      <StatsCard label="Total Referrals" value="-" icon="/icons/ReferralIcon.svg" />
    </div>
  </div>
);

export default Stats;
