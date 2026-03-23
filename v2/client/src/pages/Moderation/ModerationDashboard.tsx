import * as React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, LogOut, CheckCircle, XCircle, Search, 
  MessageSquare, Clock, AlertCircle, ChevronRight, X,
  MapPin, Home, Banknote, User, Image as ImageIcon,
  Layout, List, Type
} from "lucide-react";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./Moderation.module.css";

// --- QUICK ANSWER COMPONENT ---
function QuickAnswer({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const commonErrors = ["Некорректное описание", "Плохое качество фото", "Неверный адрес", "Заниженная цена", "Ошибка в удобствах"];
  
  return (
    <div className={s.quickAnswerWrapper}>
      <div className={s.quickAnswerHeader}>
        <AlertCircle size={14} className={s.errorIcon} />
        <span>Замечание по разделу: {label}</span>
      </div>
      <input 
        type="text"
        className={s.quickAnswerInput}
        placeholder="Введите замечание или выберите из списка..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={s.quickChips}>
        {commonErrors.map(err => (
          <button key={err} className={s.chip} onClick={() => onChange(err)}>{err}</button>
        ))}
      </div>
    </div>
  );
}

// --- PREVIEW MODAL ---
interface PreviewModalProps {
  unit: ModerationUnit;
  onClose: () => void;
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string, comment: string, details: Record<string, string>) => void;
}

function PreviewModal({ unit, onClose, onApprove, onReject }: PreviewModalProps) {
  const [generalComment, setGeneralComment] = React.useState("");
  const [details, setDetails] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleDetailChange = (id: string, value: string) => {
    setDetails(prev => ({ ...prev, [id]: value }));
  };

  const getImageUrl = (img: any) => {
    const url = img.url || img.thumbnailUrl || img;
    if (typeof url !== 'string') return "";
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <div className={s.previewOverlay}>
      <div className={s.previewContent}>
        <div className={s.previewSidebar}>
          <div className={s.sidebarHeader}>
            <h2 className={s.sidebarTitle}>Панель проверки</h2>
            <p className={s.sidebarSubtitle}>ID: {unit.id.slice(0, 8)}</p>
          </div>
          
          <div className={s.sidebarBody}>
            <div className={s.reviewSection}>
              <label className={s.sectionLabel}>Общий вердикт:</label>
              <textarea 
                className={s.reviewTextArea}
                placeholder="Общее сообщение владельцу..."
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
              />
            </div>

            <div className={s.actionGroup}>
              <button 
                className={s.modalApproveBtn}
                onClick={() => onApprove(unit.id, unit.unitType)}
                disabled={submitting}
              >
                <CheckCircle size={18} />
                Одобрить помещение
              </button>
              <button 
                className={s.modalRejectBtn}
                onClick={() => onReject(unit.id, unit.unitType, generalComment, details)}
                disabled={submitting}
              >
                <AlertCircle size={18} />
                Отклонить
              </button>
            </div>
          </div>
        </div>

        <div className={s.previewMain}>
          <button onClick={onClose} className={s.closePreviewBtn}><X /></button>
          
          <div className={s.previewScrollArea}>
            {/* Header Section */}
            <div className={s.previewCard}>
              <div className={s.previewHeader}>
                <h1 className={s.previewTitle}>{unit.displayTitle}</h1>
                <div className={s.previewBadge}>{unit.type}</div>
              </div>
              <div className={s.previewMeta}>
                <MapPin size={18} /> {unit.city}, {unit.address}
              </div>
              <QuickAnswer label="Заголовок и локация" value={details.basics || ""} onChange={v => handleDetailChange("basics", v)} />
            </div>

            {/* Photos Section */}
            <div className={s.previewCard}>
              <h3 className={s.cardHeading}><ImageIcon size={18} /> Фотографии</h3>
              <div className={s.photoGrid}>
                {unit.photos?.map((p, i) => (
                  <img key={i} src={getImageUrl(p)} alt="" className={s.previewImg} />
                ))}
                {(!unit.photos || unit.photos.length === 0) && <div className={s.noPhotos}>Нет фотографий</div>}
              </div>
              <QuickAnswer label="Фотографии" value={details.photos || ""} onChange={v => handleDetailChange("photos", v)} />
            </div>

            {/* Details Section */}
            <div className={s.previewCard}>
              <h3 className={s.cardHeading}><Layout size={18} /> Параметры и описание</h3>
              <div className={s.paramsGrid}>
                <div className={s.param}><Home size={16} /> {unit.area} м²</div>
                <div className={s.param}><User size={16} /> До {unit.capacityAdults} чел.</div>
                <div className={s.param}><Banknote size={16} /> {unit.pricePerDay} ₽ / сут.</div>
              </div>
              <div className={s.previewDescription}>{unit.description || "Описание отсутствует"}</div>
              <QuickAnswer label="Параметры и описание" value={details.description || ""} onChange={v => handleDetailChange("description", v)} />
            </div>

            {/* Amenities Section */}
            <div className={s.previewCard}>
              <h3 className={s.cardHeading}><List size={18} /> Удобства</h3>
              <div className={s.amenitiesList}>
                {Array.isArray(unit.amenities) && unit.amenities.map((a, i) => (
                  <span key={i} className={s.amenityTag}>{a}</span>
                ))}
              </div>
              <QuickAnswer label="Удобства" value={details.amenities || ""} onChange={v => handleDetailChange("amenities", v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { 
  useGetPendingUnitsQuery, 
  useGetPublishedUnitsQuery, 
  useApproveUnitMutation, 
  useRejectUnitMutation,
  type ModerationUnit
} from "../../entities/moderation/api/moderationApi.ts";
import { useSelector } from "react-redux";
import { selectCurrentToken, logout as authLogout } from "../../entities/user/model/auth-slice.ts";

// --- MAIN COMPONENT ---
export function ModerationDashboard() {
  const [activeTab, setActiveTab] = React.useState<"pending" | "published">("pending");
  const [searchId, setSearchId] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState<ModerationUnit | null>(null);
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  // RTK Query Hooks
  const { data: pendingData, isLoading: pendingLoading, refetch: refetchPending } = useGetPendingUnitsQuery(undefined, {
    skip: activeTab !== "pending" || !token
  });
  const { data: publishedData, isLoading: publishedLoading, refetch: refetchPublished } = useGetPublishedUnitsQuery(undefined, {
    skip: activeTab !== "published" || !token
  });

  const [approveUnit] = useApproveUnitMutation();
  const [rejectUnit] = useRejectUnitMutation();

  const units = (activeTab === "pending" ? pendingData?.data : publishedData?.data) || [];
  const loading = activeTab === "pending" ? pendingLoading : publishedLoading;

  const handleApprove = async (id: string, type: string) => {
    try {
      await approveUnit({ id, type }).unwrap();
      setSelectedUnit(null);
      alert("Объект одобрен");
    } catch (err) {
      alert("Ошибка при одобрении");
    }
  };

  const handleReject = async (id: string, type: string, comment: string, details: Record<string, string>) => {
    try {
      await rejectUnit({ id, type, comment, details }).unwrap();
      setSelectedUnit(null);
      alert("Объект отклонен с замечаниями");
    } catch (err) {
      alert("Ошибка при отклонении");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mod_token");
    authLogout(); // Также выходим из основного аккаунта если нужно, или просто перенаправляем
    navigate("/moderation/login");
  };

  const filteredUnits = units.filter(p => 
    p.id.toLowerCase().includes(searchId.toLowerCase()) || 
    (p.displayTitle || "").toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className={s.dashboardWrapper}>
      <header className={s.header}>
        <div className={s.headerTitle}>
          <ShieldCheck size={24} style={{ color: '#2563eb' }} />
          Панель Модерации | Hatka
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div className={s.headerTitle} style={{ fontSize: '1rem', color: '#64748b' }}>
             <MessageSquare size={18} />
             Чат поддержки
           </div>
           <button onClick={handleLogout} className={s.logoutBtn}>
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
            Ожидают проверки ({units.length})
          </button>
          <button 
            className={cn(s.tabBtn, activeTab === "published" && s.tabBtnActive)}
            onClick={() => setActiveTab("published")}
          >
            <CheckCircle size={16} />
            Активные
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
          <div className={s.loadingBox}>Загрузка данных...</div>
        ) : (
          <div className={s.propertyList}>
            {filteredUnits.length === 0 ? (
              <div className={s.emptyState}>Нет объектов в этой категории</div>
            ) : (
              filteredUnits.map((p: any) => (
                <div key={p.id} className={s.modCard}>
                  <div className={s.cardBody}>
                    <img 
                      src={p.photos?.[0]?.thumbnailUrl || p.photos?.[0]?.url || "https://placehold.co/600x400?text=No+Photo"} 
                      alt="" 
                      className={s.itemImage} 
                    />
                    <div className={s.itemInfo}>
                      <div className={s.itemHeader}>
                         <h3 className={s.itemTitle}>{p.displayTitle}</h3>
                         <span className={cn(s.typeBadge, p.unitType === 'room' ? s.badgeRoom : s.badgeListing)}>
                           {p.unitType === 'room' ? 'Номер' : 'Листинг'}
                         </span>
                      </div>
                      <div className={s.itemMeta}>
                        <span>📍 {p.city || "Город не указан"}</span>
                        <span>💰 {p.pricePerDay} ₽/сут</span>
                      </div>
                      <div className={s.itemMeta} style={{ marginTop: '0.4rem' }}>
                         <span className={s.hostLabel}>Владелец: {p.host?.firstName} ({p.host?.email})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={s.itemActions}>
                    {activeTab === "pending" ? (
                      <button 
                        onClick={() => setSelectedUnit(p)} 
                        className={s.reviewBtn}
                      >
                        Приступить к проверке
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className={s.statusBadge}>
                        <CheckCircle size={16} />
                        Опубликовано
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {selectedUnit && (
        <PreviewModal 
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
