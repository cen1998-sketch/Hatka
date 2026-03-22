"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

function Tabs({ items, activeId, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-1.5 inline-flex items-center shadow-sm",
        "border border-gray-100/50",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={cn(
              "px-5 py-2 rounded-2xl text-sm font-medium",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isActive
                ? "bg-[#F5F5F5] text-foreground font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-50/50"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

Tabs.displayName = "Tabs";

export { Tabs };
export type { TabsProps, TabItem };
