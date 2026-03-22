import { Home, Calendar as CalendarIcon, MessageCircle, Heart, User, ChevronDown } from "lucide-react";
import { NavButton } from "../../shared/ui/NavButton/NavButton.tsx";
import { ProfileButton } from "../../shared/ui/ProfileButton/ProfileButton.tsx";
import { HeaderLogo } from "../../shared/ui/HeaderLogo/HeaderLogo.tsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useScrollDirection } from "../../shared/lib/hooks/use-scroll-direction.ts";
import { useFavorites } from "../../shared/lib/hooks/use-favorites.ts";
import { selectUser } from "../../entities/user/model/auth-slice.ts";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./Header.module.css";

export function Header() {
  const user = useSelector(selectUser);
  const { favorites } = useFavorites();
  const scrollDirection = useScrollDirection();
  
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
              name={user.name || "Пользователь"}
              role={user.role === "landlord" ? "Арендодатель" : "Арендатор"}
              avatarSrc={undefined} // Map user image if available
              avatarFallback={user.name?.[0] || "У"}
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
