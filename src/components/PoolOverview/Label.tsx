import Image from "next/image";

interface LabelProps {
  text: string;
  imgSrc?: string;
}

const Label = ({ text, imgSrc }: LabelProps) => {
  return (
    <div className="inline-flex items-center gap-[10px] p-2 text-[#EFEFF0] rounded-[4px] border border-secondary-gray text-sm/4 font-medium">
      {imgSrc && <Image src={imgSrc} alt="token logo" width={20} height={20} />}
      <span>{text}</span>
    </div>
  );
};

export default Label;
