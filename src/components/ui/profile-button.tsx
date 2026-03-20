"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  name: string;
  role: string;
  avatarSrc?: string;
  avatarFallback?: string;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-11 pl-1.5 pr-4 rounded-2xl",
            "bg-white shadow-sm",
            "inline-flex items-center gap-1.5",
            "transition-all duration-200 ease-out",
            "hover:bg-white hover:shadow-md",
            "active:shadow-sm",
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
            <span className="text-foreground text-sm font-medium leading-5">
              {name}
            </span>
            <span className="self-stretch text-muted-foreground text-xs font-medium leading-4">
              {role}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
        <DropdownMenuItem>Профиль</DropdownMenuItem>
        <DropdownMenuItem>Настройки</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500">Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ProfileButton.displayName = "ProfileButton";

export { ProfileButton };
export type { ProfileButtonProps };
