"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MiniPropertyCardProps {
  image: string;
  title: string;
  price: string;
  priceLabel?: string;
  className?: string;
  onClick?: () => void;
}

function MiniPropertyCard({
  image,
  title,
  price,
  priceLabel = "за 1 сутки",
  className,
  onClick,
}: MiniPropertyCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg bg-white overflow-hidden",
        "cursor-pointer shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-md",
        "active:shadow-sm active:scale-[0.99]",
        "group/mini",
        className
      )}
    >
      <div className="h-[125px] relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover/mini:scale-110"
        />
      </div>
      <div className="p-2 px-3 flex flex-col gap-0.5">
        <span className="text-foreground font-semibold text-[14px] leading-tight truncate">
          {title}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-foreground font-bold text-[14px]">
            {price} ₽
          </span>
          <span className="text-muted-foreground text-[12px] font-medium">
            {priceLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

MiniPropertyCard.displayName = "MiniPropertyCard";

export { MiniPropertyCard };
export type { MiniPropertyCardProps };
