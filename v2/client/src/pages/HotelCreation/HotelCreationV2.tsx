import * as React from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  MapPin, 
  Wifi, 
  Car, 
  CheckCircle2, 
  Plus,
  Loader2,
  Info,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { api } from "../../shared/api/api-base.ts";
import { cn } from "../../shared/lib/clsx.ts";
import { Button } from "../../shared/ui/Button/Button.tsx";
import { Input } from "../../shared/ui/Input/Input.tsx";
import { Switch } from "../../shared/ui/Switch/Switch.tsx";
import { Badge } from "../../shared/ui/Badge/Badge.tsx";
import s from "./HotelCreation.module.css";

const AMENITIES_CATEGORIES = [
  {
    title: "Кухонная зона",
    items: ["Микроволновка", "Посуда", "Электрочайник", "Холодильник", "Обеденный стол", "Кофемашина"]
  },
  {
    title: "Ванная комната",
    items: ["Полотенца", "Халаты", "Фен", "Душ", "Ванна", "Средства гигиены"]
  },
  {
    title: "Оснащение",
    items: ["Телевизор", "Кондиционер", "Стиральная машина", "Утюг", "Сейф", "Рабочая зона"]
  }
];

const PROPERTY_SUBTYPES: Record<string, string[]> = {
  "Гостиница": ["Отель", "Хостел", "Гостевой дом", "Апарт-отель", "Мотель"],
  "Квартира": ["Квартира", "Студия", "Лофт", "Апартаменты"],
  "Дом": ["Коттедж", "Вилла", "Таунхаус", "Бунгало"],
  "Комната": ["Комната в квартире", "Комната в доме"]
};

export function HotelCreation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = React.useState<string | null>(id || null);
  
  // Current Step state
  const [step, setStep] = React.useState(id ? 3 : 2);
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [rooms, setRooms] = React.useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = React.useState(false);

  const initialType = searchParams.get("type") || "Гостиница";

  const [formData, setFormData] = React.useState({
    title: "",
    propertyType: initialType,
    propertySubtype: PROPERTY_SUBTYPES[initialType]?.[0] || initialType,
    city: "",
    address: "",
    landmarks: "",
    description: "",
    pricePerNight: "",
    deposit: "0",
    rooms: "1",
    beds: "1",
    maxGuests: "2",
    area: "",
    checkIn: "14:00",
    checkOut: "12:00",
    wifi: "Бесплатно",
    parking: "Нет",
    smoking: "Нельзя",
    animals: "Нельзя",
    children: true,
    amenities: [] as string[],
    paymentMethods: ["card"]
  });

  // Load existing data if ID is present
  React.useEffect(() => {
    if (propertyId) {
      const fetchData = async () => {
        try {
          const res = await api.get(`/properties/${propertyId}`);
          if (res.data.data) {
            const p = res.data.data;
            setFormData(prev => ({
              ...prev,
              ...p,
              pricePerNight: p.pricePerNight?.toString() || "",
              deposit: p.deposit?.toString() || "0",
              rooms: p.rooms?.toString() || "1",
              beds: p.beds?.toString() || "1",
              maxGuests: p.maxGuests?.toString() || "2",
              area: p.area?.toString() || "",
              amenities: p.amenityIds || []
            }));
            fetchRooms();
          }
        } catch (err) {
          console.error("Failed to fetch property", err);
        }
      };
      fetchData();
    }
  }, [propertyId]);

  const fetchRooms = async () => {
    if (!propertyId) return;
    setIsLoadingRooms(true);
    try {
      const res = await api.get(`/properties/${propertyId}/rooms`);
      setRooms(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Debounced Auto-save (Only from step 3 onwards)
  React.useEffect(() => {
    if (step < 3) return;
    const timer = setTimeout(() => {
      saveDraft();
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData, step]);

  const saveDraft = async () => {
    if (!formData.title && !formData.address) return;
    setIsSaving(true);
    try {
      const payload = {
          ...formData,
          propertyType: formData.propertySubtype || formData.propertyType,
          status: "DRAFT"
      };
      if (propertyId) {
        await api.put(`/properties/${propertyId}`, payload);
      } else {
        const res = await api.post("/properties", payload);
        if (res.data.data.id) {
          setPropertyId(res.data.data.id);
          window.history.replaceState(null, "", `/dashboard/create/hotel/${res.data.data.id}`);
        }
      }
      setLastSaved(new Date());
    } catch (err) {
      console.error("Auto-save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.address || !formData.city) {
        alert("Пожалуйста, заполните основные поля: Название, Город и Адрес");
        setStep(3);
        return;
    }
    setIsPublishing(true);
    try {
      if (propertyId) {
        await api.put(`/properties/${propertyId}`, { ...formData, status: "PENDING" });
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Ошибка при публикации");
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleAmenity = (name: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(name) 
        ? prev.amenities.filter(a => a !== name)
        : [...prev.amenities, name]
    }));
  };

  const nextStep = async () => {
      if (step === 2 && !formData.city) {
          alert("Пожалуйста, выберите город");
          return;
      }
      
      // If moving from 2 to 3 and no ID, create an initial draft
      if (step === 2 && !propertyId) {
          setIsSaving(true);
          try {
              const res = await api.post("/properties", {
                  ...formData,
                  propertyType: formData.propertySubtype || formData.propertyType,
                  status: "DRAFT"
              });
              if (res.data.data.id) {
                  setPropertyId(res.data.data.id);
                  window.history.replaceState(null, "", `/dashboard/create/hotel/${res.data.data.id}`);
              }
          } catch (err: any) {
              console.error("Initial save failed", err);
              alert("Не удалось создать черновик объекта: " + (err.response?.data?.details || err.message));
              setIsSaving(false);
              return; // Stop if failed
          }
          setIsSaving(false);
      }

      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
  };

  const prevStep = () => {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
  }

  return (
    <div className={s.wrapper}>
      {/* Sticky Header with breadcrumbs or status */}
      <header className={s.stickyHeader}>
        <div className={s.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => step > 2 ? prevStep() : navigate("/dashboard/create")} className={s.backBtn} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft size={20} />
            </button>
            <div className={s.stepIndicator}>
                Шаг {step} из 4: {
                    step === 2 ? "Тип и Город" : 
                    step === 3 ? "Детальная информация" : "Номера"
                }
            </div>
          </div>
          
          <div className={s.saveStatus}>
            {step >= 3 && (
                <>
                    {isSaving ? (
                    <span className={s.saving}>
                        <Loader2 size={16} className={s.loader} />
                        Сохранение...
                    </span>
                    ) : lastSaved ? (
                    <span>Изменения сохранены в {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    ) : (
                    <span>Черновик</span>
                    )}
                </>
            )}
          </div>
        </div>
      </header>

      <div className={s.container}>
        
        {/* STEP 2: Subtype & City */}
        {step === 2 && (
            <div className={s.card} style={{ gap: '2.5rem' }}>
                <div className={s.fieldGroup}>
                    <h2 className={s.sectionTitle}>Уточните тип жилья</h2>
                    <div className={s.radioGroup}>
                        {PROPERTY_SUBTYPES[formData.propertyType]?.map(st => (
                            <label key={st} className={cn(s.radioLabel, formData.propertySubtype === st && s.radioActive)}>
                                <input 
                                    type="radio" 
                                    className={s.radioInput}
                                    checked={formData.propertySubtype === st}
                                    onChange={() => setFormData({...formData, propertySubtype: st})}
                                />
                                {st}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={s.fieldGroup}>
                    <h2 className={s.sectionTitle}>В каком городе находится объект?</h2>
                    <Input 
                        placeholder="Начните вводить название города..." 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        style={{ height: '3.5rem', fontSize: '1.125rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {["Томск", "Новосибиск", "Кемерово", "Барнаул"].map(c => (
                            <Badge 
                                key={c} 
                                variant="outline" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setFormData({...formData, city: c})}
                            >
                                {c}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button 
                    variant="default" 
                    onClick={nextStep} 
                    style={{ height: '3.5rem', fontSize: '1.125rem', gap: '0.5rem' }}
                >
                    Продолжить
                    <ArrowRight size={20} />
                </Button>
            </div>
        )}

        {/* STEP 3: Detailed Info */}
        {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className={s.card}>
                    <h2 className={s.sectionTitle}>Название и Адрес</h2>
                    <div className={s.fieldGroup}>
                        <label className={s.label}>Название объекта</label>
                        <Input 
                            placeholder="Например, Отель Центральный или Уютная студия у парка"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className={s.grid2}>
                        <div className={s.fieldGroup}>
                            <label className={s.label}>Точный адрес</label>
                            <Input 
                                placeholder="Улица, номер дома/квартиры"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                        <div className={s.fieldGroup}>
                            <label className={s.label}>Ориентиры</label>
                            <Input 
                                placeholder="Вход со двора, код 123..."
                                value={formData.landmarks}
                                onChange={(e) => setFormData({...formData, landmarks: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className={s.card}>
                    <h2 className={s.sectionTitle}>Удобства и Правила</h2>
                    <div className={s.grid2}>
                        <div className={s.fieldGroup}>
                            <label className={s.label}><Wifi size={18} /> Интернет</label>
                            <div className={s.radioGroup}>
                                {["Бесплатно", "Платно", "Нет"].map(v => (
                                    <button 
                                        key={v}
                                        className={cn(s.tag, formData.wifi === v && s.tagActive)}
                                        onClick={() => setFormData({...formData, wifi: v})}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={s.fieldGroup}>
                            <label className={s.label}><Car size={18} /> Парковка</label>
                            <div className={s.radioGroup}>
                                {["Бесплатно", "Платно", "Нет"].map(v => (
                                    <button 
                                        key={v}
                                        className={cn(s.tag, formData.parking === v && s.tagActive)}
                                        onClick={() => setFormData({...formData, parking: v})}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={s.grid2} style={{ marginTop: '1rem' }}>
                        <div className={s.fieldGroup}>
                            <label className={s.label}>Время заезда</label>
                            <Input type="time" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} />
                        </div>
                        <div className={s.fieldGroup}>
                            <label className={s.label}>Время выезда</label>
                            <Input type="time" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} />
                        </div>
                    </div>

                    <div className={s.amenitiesGrid} style={{ marginTop: '1.5rem' }}>
                        {AMENITIES_CATEGORIES.map(cat => (
                            <div key={cat.title}>
                                <h4 className={s.categoryTitle} style={{ fontSize: '0.925rem', color: '#64748b' }}>{cat.title}</h4>
                                <div className={s.tagCloud} style={{ gap: '0.5rem' }}>
                                    {cat.items.map(item => (
                                        <button
                                            key={item}
                                            className={cn(s.tag, formData.amenities.includes(item) && s.tagActive)}
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            onClick={() => toggleAmenity(item)}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.card}>
                    <h2 className={s.sectionTitle}>Описание</h2>
                    <textarea 
                        className={s.textarea}
                        style={{ minHeight: '150px' }}
                        placeholder="Расскажите гостям об особенностях вашего жилья..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <Button 
                    variant="default" 
                    onClick={nextStep} 
                    style={{ height: '3.5rem', fontSize: '1.125rem', gap: '0.5rem' }}
                >
                    Продолжить к номерам
                    <ArrowRight size={20} />
                </Button>
            </div>
        )}

        {/* STEP 4: Rooms */}
        {step === 4 && (
            <div className={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className={s.sectionTitle}>Категории номеров</h2>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(`/dashboard/create/rooms/${propertyId}`)}
                        style={{ gap: '0.5rem' }}
                    >
                        <Plus size={18} />
                        Добавить номер
                    </Button>
                </div>
                
                <div className={s.roomsList} style={{ marginTop: '1.5rem' }}>
                    {isLoadingRooms ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Loader2 className={s.loader} />
                            <p>Загрузка списка номеров...</p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '1rem' }}>
                            <div style={{ marginBottom: '1rem' }}><Info size={40} style={{ opacity: 0.3, margin: '0 auto' }} /></div>
                            <p>У вас пока не добавлено ни одного номера.</p>
                            <p style={{ fontSize: '0.875rem' }}>Добавьте хотя бы одну категорию, чтобы гости могли бронировать ваш объект.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {rooms.map(room => (
                                <div key={room.id} className={s.roomItem}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                            {room.images?.[0] && <img src={room.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{room.title}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{room.price} ₽ / ночь • {room.capacity} чел. • {room.size} м²</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Badge variant="outline">Готов</Badge>
                                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><ChevronRight size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Button 
                        onClick={handlePublish}
                        disabled={isPublishing || (formData.propertyType === "Гостиница" && rooms.length === 0)}
                        className={s.publishBtn}
                        style={{ height: '4rem', fontSize: '1.25rem' }}
                    >
                        {isPublishing ? <Loader2 className={s.loader} /> : "Опубликовать объект"}
                    </Button>
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center' }}>
                        Нажимая «Опубликовать», вы отправляете объект на модерацию. 
                        Обычно проверка занимает от 1 до 24 часов.
                    </p>
                </div>
            </div>
        )}

      </div>
      <div style={{ height: '4rem' }} />
    </div>
  );
}
