"use client";

import Portfolio from "@components/Portfolio";

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function Home() {
  return (
    <main className="border-t border-secondary-gray page-center">
      <Portfolio />
    </main>
  );
}
