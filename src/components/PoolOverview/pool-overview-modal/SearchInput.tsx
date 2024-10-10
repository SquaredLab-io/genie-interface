import { SearchIcon } from "lucide-react";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";

interface PropsType {
  term: string;
  setTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  term,
  setTerm,
  placeholder,
  className
}: PropsType) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        size="16"
        className="absolute top-0 bottom-0 my-auto left-4 text-[#5F7183]"
      />
      <Input
        type="search"
        id="text"
        autoFocus={false}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        placeholder={placeholder}
        className="bg-[#10232F] pl-12 border py-3 font-normal text-[15px]/[18px] border-[#1F2D3F] placeholder:text-[#5F7183]"
      />
    </div>
  );
}
