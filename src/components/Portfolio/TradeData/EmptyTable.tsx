import NextImage from "@components/common/NextImage";

export default function EmptyTable({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <NextImage src="/icons/file-icon.svg" className="size-[62px]" altText="file icon" />
      <span className="text-[#B0B3B8] font-normal text-sm/6">
        {isLoading ? "Fetching your Positions..." : "No Open Positions."}
      </span>
    </div>
  );
}
