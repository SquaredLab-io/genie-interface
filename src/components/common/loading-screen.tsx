import Image from "next/image";

const LoadingScreen = () => {
  return (
    <main className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex border-t border-secondary-gray">
      <Image
        // src="/hello.webp"
        src="/images/genie-loading-icon.gif"
        alt="Genie DEX loading..."
        width={67}
        height={78}
        className="animate-pulse"
      />
    </main>
  );
};

export default LoadingScreen;
