import { useAccount } from "wagmi";
import StatsCard from "./stats-card";
import { UserPointsType, useUserPoints } from "@lib/hooks/useUserPoints";
import { formatTradeValue } from "../helper";
import ConnectWallet from "@components/common/ConnectWallet";
import { RewardHistoryType, useRewardHistory } from "@lib/hooks/useRewardHistory";
import RewardsTable from "./rewards-table";
import { rewardsColumns } from "./columns";

export const Stats = () => {
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
      <RewardHistory rewards={rewards} />
    </div>
  );
};

export const GpointsAndReferals = ({ points }: { points: UserPointsType }) => {
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
          value={loading ? "..." : userRank ? userRank.points.toString() : "NA"}
          icon="/icons/PointsIcon.svg"
        />
        <StatsCard
          label="Your Rank"
          value={loading ? "..." : userRank ? userRank.rank.toString() : "NA"}
          icon="/icons/RankIcon.svg"
        />
        {/* <StatsCard label="Total Referrals" value="2" icon="/icons/ReferralIcon.svg" /> */}
      </div>
    </div>
  );
};

export const UserActivity = ({
  points,
  rewards,
  isUser = false
}: {
  points: UserPointsType;
  rewards: RewardHistoryType;
  isUser?: boolean;
}) => {
  const { userPointsData, isFetching, isPending } = points;
  const { rewardHistory, isFetching: isRFetching, isPending: isRPending } = rewards;

  const userRank = userPointsData?.userPoints;
  const avgTradeSize = userPointsData?.avgTradeSize;
  return (
    <div className="flex flex-col gap-y-10 mt-10">
      <div className="flex flex-col gap-y-2 items-start">
        <h1 className="font-medium text-2xl/9">
          {!isUser && <span className="heading-gradient">Your</span>} Activity
        </h1>
        <p className="font-normal text-base/[22px] text-[#98B0C1]">
          {!isUser && "Your"} adventures on Genie are summarised here
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
          icon={
            parseFloat(userRank?.profit ?? "0") >= 0
              ? "/icons/PnlPositiveIcon.svg"
              : "/icons/PnlNegativeIcon.svg"
          }
          textStyle={
            isFetching || isPending || !userRank
              ? "text-white"
              : parseFloat(userRank.profit) > 0
                ? "text-positive-points"
                : "text-negative-points"
          }
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
          textStyle="text-positive-points"
        />
        <StatsCard
          label="Worst Trade"
          value={formatTradeValue(
            isRFetching || isRPending,
            (rewardHistory?.min ?? 0).toString()
          )}
          icon="/icons/WorstIcon.svg"
          textStyle="text-negative-points"
        />
      </div>
    </div>
  );
};

export const RewardHistory = ({
  rewards,
  isUser = false
}: {
  rewards: RewardHistoryType;
  isUser?: boolean;
}) => {
  const { rewardHistory, isFetching, isPending } = rewards;

  return (
    <div className="w-full mt-10">
      <div className="flex flex-col gap-y-2 items-start">
        <h1 className="font-medium text-2xl/9">
          {!isUser && <span className="heading-gradient">Reward</span>} History
        </h1>
        <p className="font-normal text-base/[22px] text-[#98B0C1]">
          The real reason you earn the Gpoints
        </p>
      </div>
      <RewardsTable
        data={rewardHistory?.rewardHistory ?? []}
        columns={rewardsColumns}
        loading={isFetching || isPending}
      />
    </div>
  );
};

export default Stats;
