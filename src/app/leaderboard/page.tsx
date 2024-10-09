import Hero from "@components/Leaderboard/hero";
import Sections from "@components/Leaderboard/sections";

export default function Leaderboard() {
  return (
    <main className="pl-[88px] pr-[84px] pt-16 pb-10 overflow-hidden">
      <Hero />
      <Sections />
    </main>
  );
}
