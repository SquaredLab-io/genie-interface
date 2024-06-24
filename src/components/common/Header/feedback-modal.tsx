import { useState } from "react";
import Image from "next/image";
import ModalWrapper from "@components/common/Modal";
import { Textarea } from "@components/ui/textarea";
import { cn } from "@lib/utils";

enum Feedback {
  que = "Question",
  req = "Request",
  bug = "Bug"
}

const options = [
  {
    title: Feedback.que,
    icon: "/icons/QuestionCircleIcon.svg"
  },
  {
    title: Feedback.req,
    icon: "/icons/BulbCircleIcon.svg"
  },
  {
    title: Feedback.bug,
    icon: "/icons/BugCircleIcon.svg"
  }
];

const FeedbackModal = ({
  open,
  setOpen,
  trigger
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  trigger?: React.ReactNode;
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Contact SquaredLabs Team"
      trigger={trigger}
      className="max-w-5xl"
      footer={
        <div className="inline-flex items-center justify-between w-full">
          <p>
            You can also email us at{" "}
            <a
              className="text-gradient-blue"
              href="mailto:support@squaredlabs.io"
              target="_blank"
            >
              support@squaredlabs.io
            </a>
          </p>
          <div className="font-medium text-xl/6">
            <button className="py-[10px] px-6 bg-transparent text-white border border-white rounded-2xl mr-6">
              Help Center
            </button>
            <button className="py-[10px] px-6 bg-white text-black rounded-2xl">
              Send
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-row gap-3">
        {options.map((option) => (
          <button
            key={option.title}
            className={cn(
              "inline-flex rounded-full border border-[#ECECEC] hover:bg-white/10 py-[6px] px-3 gap-3 transition-colors",
              selectedFeedback === option.title && "bg-white/10"
            )}
            onClick={() => setSelectedFeedback(option.title)}
          >
            <Image src={option.icon} width={26} height={26} alt={option.title} />
            {Feedback.que}
          </button>
        ))}
      </div>
      <Textarea placeholder="Enter text here" className="min-w-[954px] h-[228px]" />
    </ModalWrapper>
  );
};

export default FeedbackModal;
