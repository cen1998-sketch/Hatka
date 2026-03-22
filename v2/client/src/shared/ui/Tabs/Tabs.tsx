import * as React from "react";
import { cn } from "../../lib/clsx.ts";
import s from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onTabChange, className }: TabsProps) {
  return (
    <div className={cn(s.tabsContainer, className)}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={cn(s.tabBtn, isActive ? s.tabBtnActive : s.tabBtnInactive)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
