import Image from "next/image";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

interface ArgsType {
  title: string;
  description?: string;
  closable?: boolean;
  duration?: number;
}

const success = ({ title, description, closable = true, duration = 5000 }: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="inline-flex items-start gap-3 min-w-[345px] relative py-5 px-3 bg-[#00081438] border-b border-[#07AE3B] font-normal text-sm/4 rounded-sm">
        <Image
          src="/icons/toast-success.svg"
          alt="toast success"
          height={24}
          width={24}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#07AE3B]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button className="absolute top-5 right-3" onClick={() => toast.dismiss(t)}>
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
      </div>
    ),
    {
      duration
    }
  );
};

const info = ({ title, description, closable = true, duration = 5000 }: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-start gap-3 font-normal text-sm/4 py-5 px-3 bg-[#161A1C17]/5 border-b border-[#F7931A] w-full">
        <Image
          src="/icons/toast-info.svg"
          alt="toast success"
          height={24}
          width={24}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#F7931A]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button
              className="absolute top-5 right-3"
              onClick={() => toast.dismiss(t)}
            >
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
      </div>
    ),
    {
      duration
    }
  );
};

const loading = ({ title, description, closable = true, duration = 5000 }: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-start gap-3 font-normal text-sm/4 py-5 px-3 bg-[#161A1C17]/5 border-b border-[#F7931A] w-full">
        <Image
          src="/icons/toast-info.svg"
          alt="toast success"
          height={24}
          width={24}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#F7931A]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button
              className="absolute top-5 right-3"
              onClick={() => toast.dismiss(t)}
            >
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
      </div>
    ),
    {
      duration
    }
  );
};

const error = ({ title, description, closable = true, duration = 5000 }: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-start gap-3 font-normal text-sm/4 py-5 px-3 border-b border-[#FB3836] w-full">
        <Image
          src="/icons/toast-error.svg"
          alt="toast success"
          height={24}
          width={24}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#FB3836]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button
              className="absolute top-5 right-3"
              onClick={() => toast.dismiss(t)}
            >
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
      </div>
    ),
    {
      duration
    }
  );
};

/**
 * @returns Notifications: Success, Info, Error, Loading
 */
const notification = {
  success,
  info,
  error,
  loading
};

export default notification;
