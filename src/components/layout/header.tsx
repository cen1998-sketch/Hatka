"use client";

import { Home, Calendar as CalendarIcon, MessageCircle, Heart, Plus, User } from "lucide-react";
import { NavButton } from "@/components/ui/nav-button";
import { ProfileButton } from "@/components/ui/profile-button";
import { HeaderLogo } from "@/components/ui/header-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  
  return (
    <div className="w-full max-w-[1140px] py-2.5 inline-flex justify-between items-center mx-auto">
      <HeaderLogo />

      <div className="hidden lg:flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="hidden md:flex items-center gap-1 text-sm font-medium hover:bg-neutral-100 px-3">
            <Plus className="w-4 h-4" />
            Сдать жилье
          </Button>
        </Link>
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

      {session?.user ? (
        <ProfileButton
          name={session.user.name || "Пользователь"}
          // @ts-ignore
          role={session.user.role === "landlord" ? "Арендодатель" : "Арендатор"}
          avatarSrc={session.user.image || undefined}
          avatarFallback={session.user.name?.[0] || "У"}
        />
      ) : (
        <Link href="/login">
          <ProfileButton
            name="Войти"
            role="Гость"
            avatarFallback={<User className="w-4 h-4 text-neutral-500" />}
          />
        </Link>
      )}
    </div>
  );
}
