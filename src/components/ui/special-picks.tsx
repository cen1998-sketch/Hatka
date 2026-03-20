"use client";

import * as React from "react";
import { MiniPropertyCard } from "@/components/ui/mini-property-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PickItem {
  image: string;
  title: string;
  price: string;
}

interface SpecialPicksSectionProps {
  title?: string;
  subtitle?: string;
  count?: number;
  items: PickItem[];
  className?: string;
}

function SpecialPicksSection({
  title = "Подобрали специально для вас",
  count = 12,
  items,
  className,
}: SpecialPicksSectionProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-3 overflow-hidden relative group",
        "bg-gradient-to-br from-[#088470] to-[#01A187]",
        className
      )}
    >
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14 blur-3xl group-hover:bg-white/20 transition-all duration-1000" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-white leading-tight">
            {title}
          </span>
          <span className="text-xl font-semibold text-white leading-tight">
            {count} вариантов
          </span>
        </div>
        <Button
          variant="ghost"
          className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md text-sm font-medium px-4 py-1.5 h-auto rounded-xl"
        >
          Все
        </Button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        {items.slice(0, 4).map((item, i) => (
          <MiniPropertyCard
            key={i}
            image={item.image}
            title={item.title}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}

SpecialPicksSection.displayName = "SpecialPicksSection";

export { SpecialPicksSection };
export type { SpecialPicksSectionProps, PickItem };
