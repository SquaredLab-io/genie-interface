import { formatNumber, getDecimalAdjusted } from "@lib/utils/formatting";
import StatsCard from "./stats-card";
import { UserPointsType, useUserPoints } from "@lib/hooks/useUserPoints";

const Stats = () => {
  const points = useUserPoints();

  return (
    <div className="py-4 flex flex-col gap-y-14">
      <GpointsAndReferals points={points} />
      <UserActivity points={points} />
      <RewardHistory />
    </div>
  );
};

const GpointsAndReferals = ({ points }: { points: UserPointsType }) => {
  const { userPoints, isFetching } = points;

  return (
    <div className="flex flex-col gap-y-10 mt-10">
      <div className="flex flex-col gap-y-2 items-start">
        <h1 className="font-medium text-2xl/9">
          <span className="heading-gradient">Gpoints</span> And Referals
        </h1>
        <p className="font-normal text-base/[22px] text-[#98B0C1]">
          Use Genie And Invite Friends To Earn GPoints
        </p>
      </div>
      {/* Gpoints and Referals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Gpoints"
          value={isFetching ? "..." : userPoints?.points.toString()!}
          icon="/icons/PointsIcon.svg"
        />
        <StatsCard
          label="Your Rank"
          value={isFetching ? "..." : userPoints?.rank.toString()!}
          icon="/icons/RankIcon.svg"
        />
        {/* <StatsCard label="Total Referrals" value="2" icon="/icons/ReferralIcon.svg" /> */}
      </div>
    </div>
  );
};

const UserActivity = ({ points }: { points: UserPointsType }) => {
  const { userPoints, isFetching } = points;

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
          value={
            isFetching ? "..." : formatNumber(getDecimalAdjusted(userPoints?.volume, 18))
          }
          icon="/icons/VolumeIcon.svg"
        />
        <StatsCard
          label="Total Profit/loss"
          value={
            isFetching
              ? "..."
              : formatNumber(getDecimalAdjusted(userPoints?.profit.toString(), 18))
          }
          icon="/icons/PnlIcon.svg"
        />
        <StatsCard
          label="Avg Trade Size"
          value="$66,533"
          icon="/icons/TradeSizeIcon.svg"
        />
        <StatsCard label="Best Trade" value="+$1,860" icon="/icons/CheckCircleIcon.svg" />
        <StatsCard label="Worst Trade" value="-$1,860" icon="/icons/WorstIcon.svg" />
      </div>
    </div>
  );
};

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
