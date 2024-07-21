"use client";

import { cn } from "@lib/utils";
import clsx from "clsx";
import React, { forwardRef, ReactNode } from "react";

interface PropsType {
  children: string | ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const ButtonCTA = forwardRef<HTMLButtonElement, PropsType>(
  ({ children, className, disabled = false, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-sans-ibm-plex font-medium text-[14px]/6 text-white text-center py-3 disabled:opacity-70 disabled:cursor-not-allowed uppercase transition-all duration-200 bg-gradient-to-l from-secondary-blue via-secondary-blue to-primary-cyan bg-size-200 bg-pos-100 hover:bg-pos-0",
          className
        )}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ButtonCTA.displayName = "ButtonCTA";

export default ButtonCTA;
