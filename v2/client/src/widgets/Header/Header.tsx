import { Home, Calendar as CalendarIcon, MessageCircle, Heart, User, ChevronDown } from "lucide-react";
import { NavButton } from "../../shared/ui/NavButton/NavButton.tsx";
import { ProfileButton } from "../../shared/ui/ProfileButton/ProfileButton.tsx";
import { HeaderLogo } from "../../shared/ui/HeaderLogo/HeaderLogo.tsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useScrollDirection } from "../../shared/lib/hooks/use-scroll-direction.ts";
import { useFavorites } from "../../shared/lib/hooks/use-favorites.ts";
import { useGetProfileQuery } from "../../entities/user/api/userApi.ts";
import { selectCurrentToken, selectCurrentUser } from "../../entities/user/model/auth-slice.ts";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./Header.module.css";

export function Header() {
  const token = useSelector(selectCurrentToken);
  const userFromStore = useSelector(selectCurrentUser);
  
  // Автоматически запрашиваем профиль при загрузке (silent refresh через baseQueryWithReauth)
  const { data: profileResponse } = useGetProfileQuery();
  const user = profileResponse?.data || userFromStore;

  const { favorites } = useFavorites();
  const scrollDirection = useScrollDirection();
  
  const displayName = user?.firstName 
    ? (user.lastName ? `${user.firstName} ${user.lastName[0].toUpperCase()}.` : user.firstName)
    : (user?.email || "Пользователь");

  const initials = user?.firstName ? user.firstName[0].toUpperCase() : (user?.email?.[0]?.toUpperCase() || "У");
  
  return (
    <header className={cn(
      s.header,
      scrollDirection === "down" ? s.isHidden : s.isVisible
    )}>
      <div className={s.container}>
        <HeaderLogo />

        <div className={s.navSection}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <NavButton
              icon={<Home size={16} />}
              label="Сдать жилье"
            />
          </Link>
          <NavButton
            icon={<CalendarIcon size={16} />}
            label={
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                Бронирование <ChevronDown size={16} style={{ color: '#737373', marginLeft: '0.375rem' }} />
              </span>
            }
          />
          <NavButton
            icon={<MessageCircle size={16} />}
            label="Сообщения"
          />
          <Link to="/favorites" style={{ textDecoration: 'none' }}>
            <NavButton
              icon={
                <div style={{ position: 'relative' }}>
                  <Heart size={16} />
                  {favorites.length > 0 && (
                    <span className={s.favoritesBadge}>
                      {favorites.length}
                    </span>
                  )}
                </div>
              }
              label="Избранное"
            />
          </Link>
        </div>

        {user ? (
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <ProfileButton
              name={displayName}
              role={(user.role === "HOST" || user.role === "landlord" || user.role === "BOTH") ? "Арендодатель" : "Арендатор"}
              avatarSrc={user.avatarUrl as string | undefined} 
              avatarFallback={initials}
            />
          </Link>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <ProfileButton
              name="Войти"
              role="Гость"
              avatarFallback={<User size={16} style={{ color: '#737373' }} />}
            />
          </Link>
        )}
      </div>
    </header>
  );
}
