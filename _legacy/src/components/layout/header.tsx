"use client";

import { Home, Calendar as CalendarIcon, MessageCircle, Heart, Plus, User, ChevronDown } from "lucide-react";
import { NavButton } from "@/components/ui/nav-button";
import { ProfileButton } from "@/components/ui/profile-button";
import { HeaderLogo } from "@/components/ui/header-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const { favorites } = useFavorites();
  const scrollDirection = useScrollDirection();
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-transform duration-300 mt-2",
      scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className="w-full max-w-[1140px] py-2.5 px-4 md:px-0 flex justify-between items-center mx-auto">
        <HeaderLogo />

        <div className="hidden lg:flex items-center gap-1">
          <Link href="/dashboard" tabIndex={-1}>
            <NavButton
              icon={<Home className="w-4 h-4" />}
              label="Сдать жилье"
            />
          </Link>
          <NavButton
            icon={<CalendarIcon className="w-4 h-4" />}
            label={
              <span className="flex items-center gap-1">
                Бронирование <ChevronDown className="w-4 h-4 text-neutral-500 ml-1.5" />
              </span>
            }
          />
          <NavButton
            icon={<MessageCircle className="w-4 h-4" />}
            label="Сообщения"
          />
          <Link href="/favorites" tabIndex={-1}>
            <NavButton
              icon={
                <div className="relative">
                  <Heart className="w-4 h-4" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {favorites.length}
                    </span>
                  )}
                </div>
              }
              label="Избранное"
            />
          </Link>
        </div>

        {session?.user ? (
          <ProfileButton
            name={session.user.name || "Пользователь"}
            role={session.user.role === "landlord" ? "Арендодатель" : "Арендатор"}
            avatarSrc={session.user.image || undefined}
            avatarFallback={session.user.name?.[0] || "У"}
          />
        ) : (
          <Link href="/login" tabIndex={-1}>
            <ProfileButton
              name="Войти"
              role="Гость"
              avatarFallback={<User className="w-4 h-4 text-neutral-500" />}
            />
          </Link>
        )}
      </div>
    </header>
  );
}
