"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, ChevronDown } from "lucide-react";

type SearchInputVariant = "text" | "date" | "select";

interface SearchInputProps {
  label: string;
  value: string;
  variant?: SearchInputVariant;
  placeholder?: string;
  onClear?: () => void;
  onChange?: (value: string) => void;
  onClick?: () => void;
  hasBorder?: boolean;
  className?: string;
}

const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      label,
      value,
      variant = "text",
      placeholder,
      onClear,
      onChange,
      onClick,
      hasBorder = true,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "h-11 px-4 py-2 bg-white rounded-2xl",
          "flex justify-between items-center overflow-hidden cursor-pointer",
          "transition-colors duration-200 hover:bg-gray-50/50",
          className
        )}
      >
        <div className="flex-1 inline-flex flex-col justify-center items-start overflow-hidden">
          <span className="self-stretch text-muted-foreground text-xs font-medium leading-4 truncate">
            {label}
          </span>
          <div className="flex items-center gap-1.5 w-full">
            {variant === "text" ? (
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full text-foreground text-sm font-medium leading-5 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            ) : variant === "select" ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-foreground text-sm font-medium leading-5 truncate">
                  {value || placeholder}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            ) : (
              <span className={cn(
                "text-sm font-medium leading-5 truncate",
                value ? "text-foreground" : "text-muted-foreground"
              )}>
                {value || placeholder || "—"}
              </span>
            )}
          </div>
        </div>
        {variant === "text" && value && onClear && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
export type { SearchInputProps, SearchInputVariant };
