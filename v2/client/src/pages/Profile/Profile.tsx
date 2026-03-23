import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../../entities/user/model/auth-slice.ts";
import { ProfileEditor } from "../../widgets/ProfileEditor/ProfileEditor.tsx";
import { LogoutButton } from "../../features/Auth/ui/LogoutButton/LogoutButton.tsx";
import { fetchMyProperties, selectMyProperties } from "../../entities/property/model/property-slice.ts";
import { Button } from "../../shared/ui/Button/Button.tsx";
import { Plus, Building, Clock, CheckCircle, XCircle, ChevronRight, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../shared/lib/clsx.ts";
import type { AppDispatch } from "../../app/store.ts";
import { 
  useGetProfileQuery, 
  useGetSubscriptionQuery, 
  useGetReferralStatsQuery 
} from "../../entities/user/api/userApi.ts";
import s from "./Profile.module.css";

export function Profile() {
  const userFromStore = useSelector(selectCurrentUser);
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: subData } = useGetSubscriptionQuery();
  const { data: refData } = useGetReferralStatsQuery();
  
  const user = profileData?.data || userFromStore;
  const subscription = subData?.data;
  const referralStats = refData?.data;

  const properties = useSelector(selectMyProperties);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = React.useState<"info" | "properties">("info");

  React.useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);

  // Моковые данные для верстки, если нет реальных
  const initialProfileData = {
    name: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    city: user?.city || "",
    email: user?.email || "",
  };

  const isHost = user?.role === 'HOST' || user?.role === 'landlord';
  const role = isHost ? 'HOST' : 'GUEST';
  const userDisplayName = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Гость";
  const initials = user?.firstName ? user.firstName[0] + (user.lastName?.[0] || "") : "Г";

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'DRAFT': return { label: 'Черновик', color: '#94a3b8', icon: <Edit3 size={14} /> };
      case 'PENDING': return { label: 'На модерации', color: 'var(--primary)', icon: <Clock size={14} /> };
      case 'ACTIVE': return { label: 'Опубликовано', color: '#10b981', icon: <CheckCircle size={14} /> };
      case 'REJECTED': return { label: 'Отклонено', color: '#ef4444', icon: <XCircle size={14} /> };
      default: return { label: 'Неизвестно', color: '#94a3b8', icon: null };
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.header}>
          <h1 className={s.title}>Личный кабинет</h1>
          {isHost && (
            <Link to="/host/add">
              <Button className="rounded-xl h-12 px-6 gap-2" style={{ backgroundColor: 'var(--primary)' }}>
                <Plus size={18} />
                Сдать жильё
              </Button>
            </Link>
          )}
        </div>

        <div className="flex gap-4 mb-8">
           <button 
            onClick={() => setActiveTab("info")}
            className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeTab === "info" ? "bg-white shadow-sm text-gray-900 border border-gray-100" : "text-gray-400 hover:text-gray-600")}
           >
             Профиль
           </button>
           {isHost && (
             <button 
              onClick={() => setActiveTab("properties")}
              className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeTab === "properties" ? "bg-white shadow-sm text-gray-900 border border-gray-100" : "text-gray-400 hover:text-gray-600")}
             >
               Мои объекты
             </button>
           )}
        </div>
        
        {activeTab === "info" ? (
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
                <div className="flex items-center gap-4">
                  <h2 className={s.userName}>{userDisplayName}</h2>
                  {subscription && (
                     <div className={cn(s.roleBadge, subscription.daysRemaining > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                        {subscription.daysRemaining > 0 ? `${subscription.daysRemaining} дней` : "Подписка не активна"}
                     </div>
                  )}
                </div>
                <div className={s.roleBadge}>
                  {isHost ? "Арендодатель" : "Арендатор"}
                </div>
                
                {referralStats && (
                  <p className="text-sm text-gray-500 mt-2">
                    Ваш реферальный код: <span className="font-bold text-primary">{referralStats.referralCode}</span> (Бонусов: {referralStats.totalEarned} дн.)
                  </p>
                )}
              </div>
            </div>

            <div className={s.divider} />

            {/* Встроенный редактор профиля */}
            <ProfileEditor initialData={initialProfileData} />
          </div>
        ) : (
          <div className="space-y-4">
            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-200">
                <Building size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">У вас пока нет объектов</h3>
                <p className="text-gray-500 mb-8">Создайте своё первое объявление прямо сейчас</p>
                <Link to="/host/add">
                  <Button variant="outline" className="rounded-xl border-gray-200">Начать создание</Button>
                </Link>
              </div>
            ) : (
              properties.map(p => {
                const statusInfo = getStatusInfo(p.status || 'DRAFT');
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-24 h-24 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        <img 
                          src={p.images?.[0] as string || "https://placehold.co/200x200?text=House"} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="font-bold text-lg text-gray-900">{p.title || "Без названия"}</h4>
                           <div 
                            className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
                            style={{ backgroundColor: `${statusInfo.color}15`, color: statusInfo.color }}
                           >
                             {statusInfo.icon}
                             {statusInfo.label}
                           </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{p.city || "Город не указан"}, {p.address}</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                           <span>{p.type}</span>
                           <span>•</span>
                           <span>{p.pricePerNight || 0} ₽/ночь</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        {p.status === 'DRAFT' ? (
                          <Link to={`/host/add?id=${p.id}`}>
                            <Button variant="outline" className="rounded-xl h-10 px-4 text-sm gap-2">
                              <Edit3 size={14} />
                              Продолжить
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/property/${p.id}`}>
                            <Button variant="outline" className="rounded-xl h-10 px-4 text-sm gap-2">
                               Просмотр
                               <ChevronRight size={14} />
                            </Button>
                          </Link>
                        )}
                     </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        <div className={s.flexSpacer} />

        {/* Зона выхода из аккаунта */}
        <div className={s.logoutWrapper}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
