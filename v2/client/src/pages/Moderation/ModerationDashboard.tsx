import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, CheckCircle, XCircle, Search, MessageSquare, Clock } from "lucide-react";
import { api } from "../../shared/api/api-base.ts";
import type { Property } from "../../entities/property/model/types.ts";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./Moderation.module.css";

export function ModerationDashboard() {
  const [activeTab, setActiveTab] = React.useState<"pending" | "published">("pending");
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchId, setSearchId] = React.useState("");
  const navigate = useNavigate();

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "pending" ? "/moderation/pending" : "/moderation/published";
      const res = await api.get(endpoint);
      setProperties(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    const token = localStorage.getItem("mod_token");
    if (!token) navigate("/moderation/login");
    fetchItems();
  }, [activeTab, fetchItems, navigate]);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/moderation/approve/${id}`);
      setProperties(p => p.filter(item => item.id !== id));
      alert("Объект одобрен");
    } catch (err) {
      alert("Ошибка при одобрении");
    }
  };

  const handleReject = async (id: string) => {
    const comment = prompt("Укажите причину отклонения:");
    if (comment === null) return;
    try {
      await api.patch(`/moderation/reject/${id}`, { comment });
      setProperties(p => p.filter(item => item.id !== id));
      alert("Объект отклонен");
    } catch (err) {
      alert("Ошибка при отклонении");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mod_token");
    navigate("/moderation/login");
  };

  const filteredProperties = properties.filter(p => 
    p.id.toLowerCase().includes(searchId.toLowerCase()) || 
    p.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className={s.dashboardWrapper}>
      <header className={s.header}>
        <div className={s.headerTitle}>
          <ShieldCheck size={24} color="#3b82f6" />
          Панель Модерации | Hatka
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div className={s.headerTitle} style={{ fontSize: '1rem', color: '#64748b' }}>
             <MessageSquare size={18} />
             Чат поддержки
           </div>
           <button onClick={handleLogout} className={s.logoutBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}>
             <LogOut size={18} />
             Выйти
           </button>
        </div>
      </header>

      <main className={s.container}>
        <div className={s.tabs}>
          <button 
            className={cn(s.tabBtn, activeTab === "pending" && s.tabBtnActive)}
            onClick={() => setActiveTab("pending")}
          >
            <Clock size={16} />
            На проверке
          </button>
          <button 
            className={cn(s.tabBtn, activeTab === "published" && s.tabBtnActive)}
            onClick={() => setActiveTab("published")}
          >
            <CheckCircle size={16} />
            Опубликовано
          </button>
        </div>

        <div className={s.searchBox}>
           <Search size={18} className={s.searchIcon} />
           <input 
            type="text" 
            placeholder="Поиск по ID или названию..." 
            className={s.searchInput}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
           />
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className={s.propertyList}>
            {filteredProperties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Нет объектов в этой категории</div>
            ) : (
              filteredProperties.map((p) => (
                <div key={p.id} className={s.modCard}>
                  <img src={p.image || "https://placehold.co/600x400?text=No+Photo"} alt="" className={s.itemImage} />
                  <div className={s.itemInfo}>
                    <div className={s.itemHeader}>
                       <h3 className={s.itemTitle}>{p.title}</h3>
                       <span className={s.itemId}>ID: {p.id}</span>
                    </div>
                    <div className={s.itemMeta}>
                      <span>📍 {p.location || p.city}</span>
                      <span>🏠 {p.propertyType || "Отель"}</span>
                      <span>💰 {p.pricePerNight || p.price} руб/ночь</span>
                    </div>
                    <div className={s.itemMeta} style={{ marginTop: '0.5rem' }}>
                       <span>Заезд: {p.checkIn}</span>
                       <span>Выезд: {p.checkOut}</span>
                    </div>
                  </div>
                  {activeTab === "pending" && (
                    <div className={s.itemActions}>
                      <button onClick={() => handleApprove(p.id)} className={s.approveBtn}>Одобрить</button>
                      <button onClick={() => handleReject(p.id)} className={s.rejectBtn}>Отклонить</button>
                    </div>
                  )}
                  {activeTab === "published" && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 600, gap: '0.5rem' }}>
                       <CheckCircle size={20} />
                       Опубликовано
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
