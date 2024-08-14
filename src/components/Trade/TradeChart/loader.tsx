import LoadingLogo from "@components/icons/loading-logo";
import Image from "next/image";

const ChartLoader = () => (
  <div className="col-span-4 xl:col-span-3 flex flex-col items-center justify-center size-full opacity-70">
    {/* <Image
      src="/images/logo.svg"
      height={44}
      width={44}
      alt="logo loading"
      className="animate-bounce"
    /> */}
    <LoadingLogo />
    <span className="mt-2">preparing chart...</span>
  </div>
);

export default ChartLoader;
