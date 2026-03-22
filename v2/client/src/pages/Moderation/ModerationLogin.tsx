import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, User as UserIcon } from "lucide-react";
import s from "./Moderation.module.css";

export function ModerationLogin() {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая проверка (mock) по просьбе пользователя для отдельного входа
    if (login === "admin" && password === "hatka2024") {
      localStorage.setItem("mod_token", "secret_mod_session");
      navigate("/moderation/dashboard");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className={s.loginWrapper}>
      <div className={s.loginCard}>
        <div className={s.loginHeader}>
          <div className={s.modIcon}>
            <ShieldAlert size={32} />
          </div>
          <h1 className={s.loginTitle}>Вход для модераторов</h1>
          <p className={s.loginSubtitle}>Доступ только для персонала</p>
        </div>

        <form onSubmit={handleLogin} className={s.form}>
          <div className={s.inputGroup}>
            <div className={s.inputWithIcon}>
              <UserIcon size={18} className={s.fieldIcon} />
              <input 
                type="text" 
                placeholder="Логин" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className={s.input} 
                required
              />
            </div>
          </div>
          <div className={s.inputGroup}>
             <div className={s.inputWithIcon}>
              <Lock size={18} className={s.fieldIcon} />
              <input 
                type="password" 
                placeholder="Пароль" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={s.input} 
                required
              />
            </div>
          </div>
          {error && <p className={s.errorMessage}>{error}</p>}
          <button type="submit" className={s.loginBtn}>Войти в систему</button>
        </form>
      </div>
    </div>
  );
}
