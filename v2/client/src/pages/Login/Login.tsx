import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Mail, Zap } from "lucide-react";
import { cn } from "../../shared/lib/clsx.ts";
import { api } from "../../shared/api/api-base.ts";
import s from "./Login.module.css";

const STEPS = [
  {
    number: 1,
    text: "Укажи почту\nи выбери роль «Арендатор»",
  },
  {
    number: 2,
    text: "Перейди по ссылке из письма, чтобы войти в профиль",
  },
  {
    number: 3,
    text: "Настрой фильтры\nи начни искать квартиры :)",
  },
];

export function Login() {
  const [role, setRole] = React.useState<"tenant" | "landlord">("tenant");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const navigate = useNavigate();

  const [magicLink, setMagicLink] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, role });
      if (response.data.magicLink) {
        setMagicLink(response.data.magicLink);
        setIsSent(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className={s.successContainer}>
        <div className={s.successCard}>
          <div className={s.mailIconWrapper}>
            <Mail size={40} color="#f97316" />
          </div>
          <div className={s.successTextWrapper}>
            <h2 className={s.successTitle}>Письмо отправлено!</h2>
            <p className={s.successDesc}>
              Мы отправили магическую ссылку для входа на почту <span className={s.boldEmail}>{email}</span>. 
              Проверьте папку "Входящие" или "Спам".
            </p>
            {magicLink && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>ДЕМО-ССЫЛКА (имитация письма):</p>
                <a href={magicLink} style={{ color: '#d97706', fontSize: '13px', textDecoration: 'underline', wordBreak: 'break-all' }}>Зайти как {role === 'tenant' ? 'Арендатор' : 'Арендодатель'}</a>
              </div>
            )}
          </div>
          <button 
            className={s.backBtn}
            onClick={() => setIsSent(false)}
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      {/* Left Column - Information */}
      <div className={s.leftCol}>
        <div className={s.banner}>
          <div className={s.noise}></div>
          <h1 className={s.title}>
            Найдите квартиру <br /> за 3 простых шага
          </h1>
          <div className={s.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.number} className={s.stepCard}>
                <div className={s.stepNumber}>
                  {step.number}
                </div>
                <p className={s.stepText}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className={s.rightCol}>
        <div className={s.closeHeader}>
          <button onClick={() => navigate(-1)} className={s.closeButton}>
            <X size={20} color="#737373" />
          </button>
        </div>

        <div className={s.formContainer}>
          {/* Logo */}
          <div className={s.logoArea}>
            <div className={s.logoIconWrapper}>
               <Zap size={20} color="white" fill="white" />
            </div>
            <span className={s.logoText}>Хатка</span>
          </div>

          <div className={s.formContent}>
            <div className={s.headerArea}>
              <h2 className={s.formTitle}>Вход</h2>
              
              {/* Role Toggle */}
              <div className={s.roleToggle}>
                <button 
                  type="button"
                  onClick={() => setRole("tenant")}
                  className={cn(s.roleButton, role === "tenant" ? s.roleButtonActive : s.roleButtonInactive)}
                >
                  Арендатор
                </button>
                <button 
                  type="button"
                  onClick={() => setRole("landlord")}
                  className={cn(s.roleButton, role === "landlord" ? s.roleButtonActive : s.roleButtonInactive)}
                >
                  Арендодатель
                </button>
                <div 
                  className={cn(s.roleSlider, role === "tenant" ? s.roleSliderTenant : s.roleSliderLandlord)}
                />
              </div>
            </div>

            <form onSubmit={handleLogin} className={s.form}>
              <div className={s.inputWrapper}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={s.input}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={s.submitBtn}
              >
                {isLoading ? "Отправка..." : "Получить через ссылку"}
              </button>
            </form>

            <p className={s.disclaimer}>
              Когда вы нажмёте кнопку, то согласитесь с{" "}
              <Link to="/terms" className={s.link}>офертой</Link> и{" "}
              <Link to="/privacy" className={s.link}>конфиденциальностью</Link>. 
              Ознакомьтесь там все стандартно, больше не забираем души:)
            </p>
          </div>
        </div>

        <div className={s.spacer}></div>
      </div>
    </div>
  );
}
