"use client";

import { HeaderLogo } from "@/components/ui/header-logo";
import { NavButton } from "@/components/ui/nav-button";
import { ProfileButton } from "@/components/ui/profile-button";
import {
  Home,
  Calendar as CalendarIcon,
  MessageCircle,
  Heart,
} from "lucide-react";

export function Header() {
  return (
    <div className="w-full max-w-[1140px] py-2.5 inline-flex justify-between items-center mx-auto">
      <HeaderLogo />

      <div className="hidden lg:flex items-center gap-2">
        <NavButton
          icon={<Home className="w-4 h-4" />}
          label="Сдать жилье"
        />
        <NavButton
          icon={<CalendarIcon className="w-4 h-4" />}
          label="Бронирование"
        />
        <NavButton
          icon={<MessageCircle className="w-4 h-4" />}
          label="Сообщения"
        />
        <NavButton
          icon={<Heart className="w-4 h-4" />}
          label="Избранное"
        />
      </div>

      <ProfileButton
        name="Сергей Филиппов"
        role="Арендатор"
        avatarFallback="СФ"
      />
    </div>
  );
}
