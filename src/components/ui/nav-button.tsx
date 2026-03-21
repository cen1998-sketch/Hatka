"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ icon, label, isActive = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "h-11 pl-3 pr-4 rounded-[45px] inline-flex items-center gap-1.5",
          "bg-white backdrop-blur-sm shadow-sm",
          "text-sm font-medium text-foreground",
          "transition-all duration-200 ease-out",
          "hover:bg-white hover:shadow-md hover:scale-[1.02]",
          "active:bg-gray-50 active:shadow-sm active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          isActive && "bg-white shadow-md ring-1 ring-primary/20",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="w-4 h-4 flex items-center justify-center text-foreground/80">
            {icon}
          </span>
        )}
        <span>{label}</span>
      </button>
    );
  }
);

NavButton.displayName = "NavButton";

export { NavButton };
export type { NavButtonProps };
