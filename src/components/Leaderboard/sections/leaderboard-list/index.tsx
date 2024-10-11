import LeaderboardTable from "./table";
import { leaderboard_data } from "../helper";
import { leaderboardColumns } from "./columns";

const LeaderboardList = () => {
  return (
    <div className="py-4">
      <Heading />
      <LeaderboardTable
        data={leaderboard_data}
        columns={leaderboardColumns}
        loading={false}
      />
    </div>
  );
};

const Heading = () => (
  <div className="flex flex-col gap-y-2 items-start py-10">
    <h1 className="font-medium text-2xl/9">
      <span className="heading-gradient">Genie</span> Ranking
    </h1>
    <p className="font-normal text-base/[22px] text-[#98B0C1]">
      See how you rank against other Crypto Knights on GenieDex
    </p>
  </div>
);

export default LeaderboardList;
