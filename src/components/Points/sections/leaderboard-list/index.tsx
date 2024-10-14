import LeaderboardTable from "./table";
import { leaderboardColumns, rankColumns } from "./columns";
import { useLeaderboard } from "@lib/hooks/useLeaderboard";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import { useAccount } from "wagmi";

const LeaderboardList = () => {
  const { isConnected } = useAccount();
  const { ranks, isFetching, isPending } = useLeaderboard();
  const {
    userPoints,
    isFetching: isPointsFetching,
    isPending: isUserPending
  } = useUserPoints();

  return (
    <div className="py-4 w-full flex flex-col gap-10">
      <Heading />
      {isConnected && (
        <LeaderboardTable
          data={userPoints ? [userPoints] : []}
          columns={rankColumns}
          loading={isPointsFetching || isUserPending}
          isRank={true}
        />
      )}
      <LeaderboardTable
        data={ranks ?? []}
        columns={leaderboardColumns}
        loading={isFetching || isPending}
      />
    </div>
  );
};

const Heading = () => (
  <div className="flex flex-col gap-y-2 items-start pt-10">
    <h1 className="font-medium text-2xl/9">
      <span className="heading-gradient">Genie</span> Ranking
    </h1>
    <p className="font-normal text-base/[22px] text-[#98B0C1]">
      See how you rank against other Crypto Knights on GenieDex
    </p>
  </div>
);

export default LeaderboardList;
