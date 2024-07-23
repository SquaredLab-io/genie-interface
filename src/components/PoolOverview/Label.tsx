import Image from "next/image";
import { useMemo } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useAccount } from "wagmi";

interface LabelProps {
  text: string;
  imgSrc?: string;
  link?: string;
}

const Label = ({ text, imgSrc, link }: LabelProps) => {
  // const { chain } = useAccount();
  // const explororUrl = `${chain?.blockExplorers.default.url}/address/${link}`;

  return (
    <div className="inline-flex items-center gap-[10px] p-2 text-[#EFEFF0] rounded-[4px] border border-secondary-gray text-sm/4 font-medium">
      {imgSrc && <Image src={imgSrc} alt="token logo" width={20} height={20} />}
      <span>{text}</span>
      {/* {link && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={explororUrl}
          className="text-[#3D85C6] inline-flex items-center gap-2"
        >
          {link.substring(0, 7)}...
          <HiOutlineExternalLink size={10} color="#3D85C6" />
        </a>
      )} */}
    </div>
  );
};

export default Label;
