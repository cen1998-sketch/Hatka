"use client";

import * as React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderLogoProps {
  className?: string;
}

function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "h-11 pl-3 pr-4 rounded-[45px]",
        "bg-white shadow-sm",
        "inline-flex items-center gap-1.5",
        "transition-all duration-200 ease-out",
        "hover:bg-white hover:shadow-md hover:scale-[1.02]",
        "active:scale-[0.98] active:shadow-sm",
        "group",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Home className="w-5 h-5 text-orange-500 fill-orange-500" strokeWidth={2.5} />
        <span className="font-bold text-lg tracking-tight text-foreground">
          Хатка
        </span>
      </div>
    </Link>
  );
}

HeaderLogo.displayName = "HeaderLogo";

export { HeaderLogo };
