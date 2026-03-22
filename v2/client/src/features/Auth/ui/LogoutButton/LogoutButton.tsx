import * as React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import s from "./LogoutButton.module.css";

export function LogoutButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLogout = () => {
    // Иммитация логаута
    navigate('/');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={s.button}
      >
        <LogOut size={20} />
        Выйти из аккаунта
      </button>

      {isOpen && (
        <div 
          className={s.overlay}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className={s.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={s.title}>Выход из аккаунта</h2>
            <p className={s.desc}>
              Вы уверены, что хотите выйти из профиля? Вам придется снова запрашивать ссылку для входа, чтобы вернуться.
            </p>
            <div className={s.actions}>
              <button
                onClick={() => setIsOpen(false)}
                className={s.cancelBtn}
              >
                Отмена
              </button>
              <button
                onClick={handleLogout}
                className={s.logoutBtn}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
