import animationData from "@components/icons/loading-logo-lottie.json";
import Lottie from "react-lottie";

const LoadingScreen = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <main className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex border-t border-secondary-gray">
      <Lottie options={defaultOptions} height={78} width={67} />
    </main>
  );
};

export default LoadingScreen;
