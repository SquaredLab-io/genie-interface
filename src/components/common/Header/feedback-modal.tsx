import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import ModalWrapper from "@components/common/Modal";
import { Textarea } from "@components/ui/textarea";
import { cn } from "@lib/utils";
import { meta } from "@lib/constants";
import { DialogHeader, DialogTitle } from "@components/ui/dialog";

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

type status = "idle" | "loading" | "success" | "error";

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
  const [status, setStatus] = useState<status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const payload = { type: selectedFeedback, text: feedback };
    try {
      const response = await axios.post("/api/feedback", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      setStatus("success");
      setFeedback("");
      setSelectedFeedback(Feedback.que);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  const handleFeedbackOptionClick = (option: Feedback) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectedFeedback(option);
  };

  return (
    <ModalWrapper
      open={open}
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
            <button
              className="py-2 px-7 bg-white text-black border border-white rounded-base leading-6"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      }
    >
      <DialogHeader>
        <DialogTitle className="font-normal text-lg/6">
          Contact Genie DEX team
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-3 mt-4 mb-5">
          {/* Feedback type option selector */}
          {options.map((option) => (
            <button
              type="button"
              key={option.title}
              className={cn(
                "inline-flex items-center text-[#C9C9C9] rounded-full border border-secondary-gray hover:bg-white/10 py-[5px] px-5 gap-1 transition-colors font-normal text-xs/6",
                selectedFeedback === option.title && "bg-white/10"
              )}
              onClick={handleFeedbackOptionClick(option.title)}
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
      </form>
      {status === "success" && (
        <div className="inline-flex items-center justify-start gap-2 mt-4 border-green-700 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <p>Feedback sent successfully!</p>
        </div>
      )}
      {status === "error" && (
        <div className="inline-flex items-center justify-start gap-2 mt-4 border-red-700 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <p>Failed to send feedback. Please try again.</p>
        </div>
      )}
    </ModalWrapper>
  );
};

export default FeedbackModal;
