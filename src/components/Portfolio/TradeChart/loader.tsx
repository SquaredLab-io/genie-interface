import Image from "next/image";

const ChartLoader = () => (
  <div className="flex flex-col items-center h-full max-h-max justify-center opacity-70">
    <Image
      src="/images/logo.svg"
      height={44}
      width={44}
      alt="logo loading"
      className="animate-bounce"
    />
    <span className="mt-2">preparing chart...</span>
  </div>
);

export default ChartLoader;
