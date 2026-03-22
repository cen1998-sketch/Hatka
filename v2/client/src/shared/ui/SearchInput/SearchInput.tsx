import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "../../lib/clsx.ts";
import s from "./SearchInput.module.css";

type SearchInputVariant = "text" | "date" | "select";

interface SearchInputProps {
  label: string;
  value: string;
  variant?: SearchInputVariant;
  placeholder?: string;
  onClear?: () => void;
  onChange?: (value: string) => void;
  onClick?: () => void;
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
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(s.searchInput, className)}
      >
        <div className={s.content}>
          <span className={s.label}>
            {label}
          </span>
          <div className={s.valueContainer}>
            {variant === "text" ? (
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={s.input}
              />
            ) : variant === "select" ? (
              <div className={s.selectValue}>
                <span className={cn(s.textValue, !value && s.textValuePlaceholder)}>
                  {value || placeholder}
                </span>
                <ChevronDown className={s.chevron} />
              </div>
            ) : (
              <span className={cn(s.textValue, !value && s.textValuePlaceholder)}>
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
            className={s.clearButton}
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
export type { SearchInputProps, SearchInputVariant };
