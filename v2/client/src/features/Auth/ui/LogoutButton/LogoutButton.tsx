import * as React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../../entities/user/api/authApi.ts";
import { logout } from "../../../../entities/user/model/auth-slice.ts";
import { baseApi } from "../../../../shared/api/baseApi.ts";
import s from "./LogoutButton.module.css";

export function LogoutButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      setIsOpen(false);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: force local logout even if api fails
      dispatch(logout());
      navigate('/login');
    }
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
