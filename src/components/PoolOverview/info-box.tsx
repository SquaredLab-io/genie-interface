import { cn } from "@lib/utils";
import { Info } from "lucide-react";

export function InfoBox({
  isError = false,
  message = "The tokens in your wallet are being converted automatically by Genie for a small fee."
}: {
  isError?: boolean;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between mt-2 bg-[#00456D14] bg-opacity-10 py-4 px-6 gap-4 rounded-[4px] border w-full",
        isError ? "border-error-red" : "border-[#01A1FF]"
      )}
    >
      <Info size={22} color={!isError ? "#01A1FF" : "#FF0000"} />
      <p className="font-normal text-left w-full text-sm/[18px] max-w-72">{message}</p>
    </div>
  );
}
