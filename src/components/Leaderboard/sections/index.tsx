"use client";

import { useState } from "react";
import { TabsList } from "@radix-ui/react-tabs";
import { PlusIcon } from "lucide-react";
import clsx from "clsx";
import { Tabs, TabsContent, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { LeaderboardOptions } from "./helper";
import LeaderboardList from "./leaderboard-list";
import Stats from "./stats";

const Sections = () => {
  const [currentTab, setCurrentTab] = useState(LeaderboardOptions.stats);

  const activeTabStyle = clsx(
    "py-2 px-6 rounded-lg border border-primary-gray",
    "data-[state=active]:border-tab-blue data-[state=active]:bg-[#0A344D]",
    "transition-colors duration-300 ease-linear"
  );

  return (
    <div className="py-10">
      <Tabs value={currentTab} onValueChange={setCurrentTab as (value: string) => void}>
        <div className="inline-flex items-center justify-between w-full font-medium text-sm/5 py-4 border-t border-b border-secondary-gray ">
          <TabsList className="inline-flex gap-x-3">
            <TabsTrigger
              value={LeaderboardOptions.leaderboard}
              className={cn(activeTabStyle)}
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value={LeaderboardOptions.stats} className={cn(activeTabStyle)}>
              Your Stats
            </TabsTrigger>
          </TabsList>
          <button
            className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex disabled:cursor-not-allowed disabled:opacity-80"
            // onClick={() => setOpenCreateTokenModal(true)}
            // disabled={true}
          >
            <PlusIcon size={16} /> Refer Friends
          </button>
        </div>
        <TabsContent value={LeaderboardOptions.leaderboard}>
          <LeaderboardList />
        </TabsContent>
        <TabsContent value={LeaderboardOptions.stats}>
          <Stats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sections;
