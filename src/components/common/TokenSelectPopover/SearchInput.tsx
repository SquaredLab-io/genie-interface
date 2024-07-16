import { Input } from "@components/ui/input";
import { SearchIcon } from "lucide-react";

interface PropsType {
  term: string;
  setTerm: (value: string) => void;
}

export default function SearchInput({ term, setTerm }: PropsType) {
  return (
    <div className="relative px-4 mt-4">
      <SearchIcon
        size="16"
        className="absolute top-0 bottom-0 my-auto left-6 font-normal text-xs/6 text-[#9299AA]"
      />
      <Input
        type="search"
        id="text"
        autoFocus={false}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        placeholder="Search markets"
        className="bg-primary-gray pl-8 border border-secondary-gray placeholder:text-white"
      />
    </div>
  );
}
