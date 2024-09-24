import { useState } from "react";
import Image from "next/image";
import ModalWrapper from "@components/common/Modal";
import { Textarea } from "@components/ui/textarea";
import { cn } from "@lib/utils";
import { meta } from "@lib/constants";
import { DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import Link from "next/link";

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
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback>(Feedback.que);
  const [feedback, setFeedback] = useState("");

  function mailToLink() {
    const subject = encodeURIComponent(`Genie - ${selectedFeedback}`);
    const body = encodeURIComponent(feedback);
    return `mailto:${meta.SUPPORT_MAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <ModalWrapper
      open={true}
      // open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className="max-w-fit px-7 py-6 rounded-[20px]"
      footer={
        <div className="inline-flex items-center justify-between w-full mt-5 text-xs/6">
          <p>
            You can also email us at{" "}
            <a
              className="text-primary-blue"
              href="mailto:support@squaredlabs.io"
              target="_blank"
            >
              {meta.SUPPORT_MAIL}
            </a>
          </p>
          <div className="font-medium text-xs/6">
            <Link href={meta.DISCORD} target="_blank">
              <button className="px-7 py-1 hover:bg-white/5 text-white border border-secondary-gray rounded-base mr-6 leading-6">
                Help Center
              </button>
            </Link>
            <a
              className="py-2 px-7 bg-white text-black border border-white rounded-base leading-6"
              href={mailToLink()}
              target="_blank"
            >
              Send
            </a>
          </div>
        </div>
      }
    >
      <DialogHeader>
        <DialogTitle className="font-normal text-lg/6">
          Contact Genie DEX team
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-row gap-3 mt-4 mb-5">
        {/* Feedback type option selector */}
        {options.map((option) => (
          <button
            key={option.title}
            className={cn(
              "inline-flex items-center text-[#C9C9C9] rounded-full border border-secondary-gray hover:bg-white/10 py-[5px] px-5 gap-1 transition-colors font-normal text-xs/6",
              selectedFeedback === option.title && "bg-white/10"
            )}
            onClick={() => setSelectedFeedback(option.title)}
          >
            <Image src={option.icon} width={16} height={16} alt={option.title} />
            {option.title}
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Enter text here"
        onChange={(event) => {
          setFeedback(event.target.value);
        }}
        value={feedback}
        className="min-w-[954px] h-[228px] border border-secondary-gray max-w-[694px]"
      />
    </ModalWrapper>
  );
};

export default FeedbackModal;
