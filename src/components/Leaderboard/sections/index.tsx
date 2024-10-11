"use client";

import { useState } from "react";
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@components/ui/tabs";
import { LeaderboardOptions } from "./helper";
import LeaderboardList from "./leaderboard-list";
import Stats from "./stats";

const Sections = () => {
  const [currentTab, setCurrentTab] = useState(LeaderboardOptions.stats);
  // Referral Feature. Postponed.
  // const { openReferralModal, setOpenReferralModal } = useModalStore();
  return (
    <div className="py-10">
      <Tabs value={currentTab} onValueChange={setCurrentTab as (value: string) => void}>
        <div className="inline-flex items-center justify-between w-full font-medium text-sm/5 py-4 border-t border-b border-secondary-gray ">
          <TabsList className="inline-flex gap-x-3">
            <TabsTrigger
              value={LeaderboardOptions.leaderboard}
              className="active-tab-leaderboard"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value={LeaderboardOptions.stats}
              className="active-tab-leaderboard"
            >
              Your Stats
            </TabsTrigger>
          </TabsList>
          {/* <button
            className="inline-flex items-center py-2 px-3 gap-1 text-[#49AFE9] hover:bg-[#0A344D] transition-colors font-medium text-sm/5 rounded-lg font-sans-ibm-plex disabled:cursor-not-allowed disabled:opacity-80"
            onClick={() => setOpenReferralModal(true)}
          >
            <PlusIcon size={16} /> Refer Friends
          </button> */}
        </div>
        <TabsContent value={LeaderboardOptions.leaderboard}>
          <LeaderboardList />
        </TabsContent>
        <TabsContent value={LeaderboardOptions.stats}>
          <Stats />
        </TabsContent>
      </Tabs>
      {/* {openReferralModal && <ReferralModal />} */}
    </div>
  );
};

export default Sections;
