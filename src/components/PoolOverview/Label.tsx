import Image from "next/image";
import { HiOutlineExternalLink } from "react-icons/hi";

interface LabelProps {
  text: string;
  imgSrc?: string;
  link?: string;
}

const Label = ({ text, imgSrc, link }: LabelProps) => (
  <div className="inline-flex items-center gap-[10px] px-[10px] text-[#EFEFF0] py-[6px] rounded-[4px] bg-[#16191F] text-sm/5 font-semibold">
    {imgSrc && <Image src={imgSrc} alt="token logo" width={20} height={20} />}
    <span>{text}</span>
    {link && (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        className="text-[#3D85C6] inline-flex items-center gap-2"
      >
        {link}
        <HiOutlineExternalLink size={10} color="#3D85C6" />
      </a>
    )}
  </div>
);

export default Label;
