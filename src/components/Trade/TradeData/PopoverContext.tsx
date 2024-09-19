import React, { createContext, useState, useContext, ReactNode } from "react";

interface PopoverContextType {
  openPopoverId: string | null;
  setOpenPopoverId: (id: string | null) => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export const PopoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  return (
    <PopoverContext.Provider value={{ openPopoverId, setOpenPopoverId }}>
      {children}
    </PopoverContext.Provider>
  );
};

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
};
