"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  name: string;
  role: string;
  avatarSrc?: string;
  avatarFallback?: React.ReactNode;
  className?: string;
}

function ProfileButton({
  name,
  role,
  avatarSrc,
  avatarFallback = "СФ",
  className,
}: ProfileButtonProps) {
  return (
    <Link href="/profile"
      className={cn(
        "h-11 pl-1.5 pr-4 rounded-2xl",
        "bg-white shadow-sm",
        "inline-flex items-center gap-1.5",
        "transition-all duration-200 ease-out",
        "hover:bg-white hover:shadow-md hover:scale-[1.02]",
        "active:scale-[0.98] active:shadow-sm",
        "outline-none",
        "group",
        className
      )}
    >
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage src={avatarSrc} alt={name} className="rounded-full" />
        <AvatarFallback className="bg-primary text-white font-bold text-[10px] rounded-full">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:flex flex-col justify-center items-start">
        <span className="text-foreground text-sm font-medium leading-5 line-clamp-1 max-w-[120px]">
          {name}
        </span>
        <span className="self-stretch text-muted-foreground text-xs font-medium leading-4">
          {role}
        </span>
      </div>
    </Link>
  );
}

ProfileButton.displayName = "ProfileButton";

export { ProfileButton };
export type { ProfileButtonProps };
