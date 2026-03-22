"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterGroupProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function FilterGroup({
  title,
  description,
  children,
  className,
  headerAction,
}: FilterGroupProps) {
  return (
    <div className={cn("w-72 p-6 bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-sm", className)}>
      {(title || headerAction) && (
        <div className="self-stretch flex justify-between items-start">
          <div className="flex-1 flex flex-col gap-1">
            {title && (
              <h3 className="text-black text-base font-semibold font-['NT_Somic'] leading-6">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-muted-foreground text-xs font-medium font-['NT_Somic'] leading-4">
                {description}
              </p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className="self-stretch">
        {children}
      </div>
    </div>
  );
}
