"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromoBannerProps {
  className?: string;
}

function PromoBanner({ className }: PromoBannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden relative group",
        "h-[200px] flex flex-col justify-between p-5",
        "bg-[#041C18]",
        className
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004639]/80 via-transparent to-[#FA3C3C]/10" />
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#004639] rounded-full blur-[85px] opacity-60" />
      <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-[#FA3C3C] rounded-full blur-[58px] opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#022D26] rounded-full blur-[50px] opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-white font-extrabold text-base uppercase leading-none mb-1.5 tracking-wide">
          14 дней премиума
        </h3>
        <p className="text-white/70 text-[10px] leading-tight font-medium">
          Делись промокодом
          <br />с друзьями сейчас!
        </p>
      </div>

      {/* CTA Button */}
      <Button
        className={cn(
          "relative z-10 w-full rounded-xl h-10",
          "bg-foreground text-white",
          "hover:bg-foreground/90 hover:scale-[1.01]",
          "active:bg-foreground/80 active:scale-[0.99]",
          "text-sm font-medium transition-all duration-200"
        )}
      >
        Получить
      </Button>
    </div>
  );
}

PromoBanner.displayName = "PromoBanner";

export { PromoBanner };
export type { PromoBannerProps };
