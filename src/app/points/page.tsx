import Hero from "@components/Points/hero";
import Sections from "@components/Points/sections";

export default function Leaderboard() {
  return (
    <main className="pl-[88px] pr-[84px] pt-16 pb-10 overflow-hidden">
      <Hero />
      <Sections />
    </main>
  );
}
