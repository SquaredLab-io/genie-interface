"use client";

import { ReactNode } from "react";
import LoadingLogo from "@components/icons/loading-logo";

const Loading = () => (
  <main className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex border-t border-secondary-gray">
    <LoadingLogo />
  </main>
);

export default Loading;
