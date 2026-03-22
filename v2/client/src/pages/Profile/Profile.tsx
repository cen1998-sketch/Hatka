import { useSelector } from "react-redux";
import { selectUser } from "../../entities/user/model/auth-slice.ts";
import { ProfileEditor } from "../../widgets/ProfileEditor/ProfileEditor.tsx";
import { LogoutButton } from "../../features/Auth/ui/LogoutButton/LogoutButton.tsx";
import s from "./Profile.module.css";

export function Profile() {
  const user = useSelector(selectUser);

  // Моковые данные для верстки, если нет реальных
  const initialProfileData = {
    name: user?.name || "Иван",
    lastName: user?.lastName || "Иванов",
    phone: user?.phone || "+7 (999) 123-45-67",
    city: user?.city || "Томск",
    email: user?.email || "ivan@example.com",
  };

  const role = user?.role || "tenant";
  const userDisplayName = user?.name ? `${user.name} ${user.lastName || ""}` : "Иван Иванов";
  const initials = user?.name ? user.name[0] + (user.lastName?.[0] || "") : "ИИ";

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.header}>
          <h1 className={s.title}>Мой профиль</h1>
        </div>
        
        <div className={s.card}>
          {/* Декоративный бэкграунд шапки карточки */}
          <div className={s.cardBg} />

          {/* Аватарка и основная информация */}
          <div className={s.userInfo}>
            <div className={s.avatarWrapper}>
              {initials}
              <div className={s.statusDot}></div>
            </div>
            <div className={s.userText}>
              <h2 className={s.userName}>{userDisplayName}</h2>
              <div className={s.roleBadge}>
                {role === "landlord" ? "Арендодатель" : "Арендатор"}
              </div>
              
              <p className={s.userDesc}>
                Управляйте личной информацией и контактными данными для удобного бронирования жилья.
              </p>
            </div>
          </div>

          <div className={s.divider} />

          {/* Встроенный редактор профиля */}
          <ProfileEditor initialData={initialProfileData} />
        </div>

        <div className={s.flexSpacer} />

        {/* Зона выхода из аккаунта */}
        <div className={s.logoutWrapper}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
