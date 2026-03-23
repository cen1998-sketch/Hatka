import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  selectPropertyDraft, 
  updateDraft, 
  resetDraft,
  submitProperty
} from "../../../entities/property/model/draft-slice";
import { PropertyPhotosForm } from "../../../features/PropertyPhotosForm/ui/PropertyPhotosForm";
import { Button } from "../../../shared/ui/Button/Button";
import { Input } from "../../../shared/ui/Input/Input";
import { cn } from "../../../shared/lib/clsx";
import type { RootState, AppDispatch } from "../../../app/store";
import { 
  MapPin, 
  Wifi, 
  ParkingCircle, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Camera,
  Star,
  Info,
  Building2,
  CheckCircle2,
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import s from "./PropertySinglePageForm.module.css";

const AMENITY_CATEGORIES = [
  {
    title: 'Питание',
    items: ['Чай/кофе', 'Кухня в номере', 'Электрочайник', 'Мини-бар']
  },
  {
    title: 'Спорт',
    items: ['Тренажерный зал', 'Настольный теннис', 'Бильярд', 'Теннисный корт']
  },
  {
    title: 'Спа',
    items: ['Баня', 'Сауна', 'Хаммам', 'Массаж', 'Бассейн']
  }
];

export const PropertySinglePageForm: React.FC = () => {
  const draft = useSelector((state: RootState) => selectPropertyDraft(state));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const { type, rules, hasWifi, hasParking, meals, amenityIds } = draft;
  const isHotel = type === 'HOTEL_ROOM' || typeParam === 'Гостиница';

  // Sync type from URL
  React.useEffect(() => {
    if (typeParam === 'Гостиница' && type !== 'HOTEL_ROOM') {
      dispatch(updateDraft({ type: 'HOTEL_ROOM' }));
    }
  }, [typeParam, dispatch, type]);

  const [activeSection, setActiveSection] = React.useState('general');

  const handleUpdate = (data: any) => dispatch(updateDraft(data));

  const toggleAmenity = (id: string) => {
    const newIds = amenityIds.includes(id)
      ? amenityIds.filter((i: string) => i !== id)
      : [...amenityIds, id];
    handleUpdate({ amenityIds: newIds });
  };

  const navItems = [
    { id: 'general', label: 'Основная информация' },
    { id: 'photos', label: 'Фотографии' },
    { id: 'rooms', label: 'Номера' },
  ];

  const handlePublish = async () => {
    try {
      const result = await dispatch(submitProperty()).unwrap();
      alert('Объект отправлен на модерацию!');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err || 'Ошибка при отправке на модерацию');
    }
  };

  return (
    <div className={s.form}>
      <div className={s.layout}>
        {/* Sidebar Navigation */}
        <aside className={s.sidebar}>
          <div className={s.sidebarCard}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={cn(s.navItem, activeSection === item.id && s.activeNavItem)}
              >
                {item.label}
                {activeSection === item.id && <div className={s.activeDot} />}
              </button>
            ))}
          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#FFF7ED', borderRadius: '1.5rem', border: '1px solid #FFEDD5', display: 'flex', gap: '1rem' }}>
             <div style={{ height: '2.5rem', width: '2.5rem', flexShrink: '0', borderRadius: '0.75rem', background: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Info size={18} />
             </div>
             <div>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7C2D12', lineHeight: '1.4', margin: 0 }}>
                  Заполните профиль на 100%, чтобы получить значок «Проверено»
                </p>
             </div>
          </div>
        </aside>

        {/* Main Form Content */}
        <div className={s.mainContent}>
          <div id="general" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Basic Info */}
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <Building2 size={24} color="#3B82F6" strokeWidth={2.5} />
                <h2 className={s.sectionTitle}>Название и адрес</h2>
              </div>

              <div className={s.grid2}>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Название объекта</label>
                  <Input 
                    placeholder="Например: Radisson Blu Hotel" 
                    value={draft.title}
                    onChange={(e) => handleUpdate({ title: e.target.value })}
                    style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1rem' }}
                  />
                </div>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Город</label>
                  <Input 
                    placeholder="Выберите город" 
                    value={draft.city}
                    onChange={(e) => handleUpdate({ city: e.target.value })}
                    style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1rem' }}
                  />
                </div>
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label}>Улица, дом</label>
                <Input 
                  placeholder="Например: ул. Ленина, д. 10" 
                  value={draft.address}
                  onChange={(e) => handleUpdate({ address: e.target.value })}
                  style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1rem' }}
                />
              </div>
            </div>

            {/* 2. Hotel Specifics */}
            {isHotel && (
              <div className={s.sectionCard}>
                <div className={s.sectionHeader}>
                  <Star size={24} color="#FBBF24" strokeWidth={2.5} />
                  <h2 className={s.sectionTitle}>Категория и реестр</h2>
                </div>
                <div className={s.grid2}>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Количество звезд</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleUpdate({ starRating: star })}
                          style={{
                            height: '3.5rem', width: '3.5rem', borderRadius: '1rem',
                            background: draft.starRating === star ? '#FEF3C7' : '#F9FAFB',
                            color: draft.starRating === star ? '#D97706' : '#9CA3AF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', cursor: 'pointer'
                          }}
                        >
                          <Star size={20} fill={draft.starRating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Номер в реестре</label>
                    <Input 
                      placeholder="Напр: 550000001" 
                      value={draft.registryNumber}
                      onChange={(e) => handleUpdate({ registryNumber: e.target.value })}
                      style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Internet & Parking */}
            <div className={s.grid2}>
               <div className={s.sectionCard} style={{ padding: '2rem' }}>
                  <div className={s.sectionHeader}>
                    <Wifi size={20} color="#3B82F6" strokeWidth={2.5} />
                    <h2 className={s.sectionTitle} style={{ fontSize: '1rem' }}>Интернет</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {['free', 'paid', 'none'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => handleUpdate({ hasWifi: opt })}
                        className={cn(s.btnOption, hasWifi === opt && s.activeOption)}
                      >
                        {opt === 'free' ? 'Бесплатный Wi-Fi' : opt === 'paid' ? 'Платный Wi-Fi' : 'Нет'}
                        {hasWifi === opt && <CheckCircle2 size={18} />}
                      </button>
                    ))}
                  </div>
               </div>
               <div className={s.sectionCard} style={{ padding: '2rem' }}>
                  <div className={s.sectionHeader}>
                    <ParkingCircle size={20} color="#10B981" strokeWidth={2.5} />
                    <h2 className={s.sectionTitle} style={{ fontSize: '1rem' }}>Парковка</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {['free', 'paid', 'none'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => handleUpdate({ hasParking: opt })}
                        className={cn(s.btnOption, hasParking === opt && s.activeOption)}
                        style={hasParking === opt ? { background: '#ECFDF5', color: '#059669', boxShadow: '0 0 0 2px #D1FAE5' } : {}}
                      >
                        {opt === 'free' ? 'Бесплатная' : opt === 'paid' ? 'Платная' : 'Нет'}
                        {hasParking === opt && <CheckCircle2 size={18} />}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* 4. Питание */}
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <Utensils size={24} color="#F97316" strokeWidth={2.5} />
                <h2 className={s.sectionTitle}>Питание</h2>
              </div>
              <div className={s.mealGrid}>
                {[
                  { id: 'none', label: 'Без питания' },
                  { id: 'breakfast', label: 'Завтрак' },
                  { id: 'half_board', label: 'Полупансион' },
                  { id: 'full_board', label: 'Полный пансион' },
                  { id: 'all_inclusive', label: 'Все включено' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => handleUpdate({ meals: opt.id })}
                    className={cn(s.mealItem, meals === opt.id && s.activeMeal)}
                  >
                    <span className={s.mealLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Amenities */}
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <Sparkles size={24} color="#A855F7" strokeWidth={2.5} />
                <h2 className={s.sectionTitle}>Удобства и услуги</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {AMENITY_CATEGORIES.map(category => (
                  <div key={category.title} className={s.fieldGroup}>
                    <h4 className={s.label}>{category.title}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {category.items.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleAmenity(item)}
                          style={{
                            padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '800',
                            background: amenityIds.includes(item) ? '#F3E8FF' : '#F9FAFB',
                            color: amenityIds.includes(item) ? '#7E22CE' : '#6B7280',
                            transition: 'all 0.2s', border: 'none', cursor: 'pointer'
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Rules */}
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <ShieldCheck size={24} color="#10B981" strokeWidth={2.5} />
                <h2 className={s.sectionTitle}>Правила проживания</h2>
              </div>
              <div className={s.ruleGrid}>
                {[
                  { id: 'smoking', label: 'Можно курить', icon: '🚬' },
                  { id: 'parties', label: 'Вечеринки', icon: '🎉' },
                  { id: 'pets', label: 'С питомцами', icon: '🐶' },
                  { id: 'children', label: 'С детьми', icon: '👶' },
                ].map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => handleUpdate({ rules: { ...rules, [rule.id]: !rules[rule.id as keyof typeof rules] } })}
                    className={cn(s.ruleItem, rules[rule.id as keyof typeof rules] && s.activeRule)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{rule.icon}</span> 
                      {rule.label}
                    </span>
                    {rules[rule.id as keyof typeof rules] && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Description */}
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <FileText size={24} color="#3B82F6" strokeWidth={2.5} />
                <h2 className={s.sectionTitle}>Описание</h2>
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Опишите ваш объект подробно</label>
                <textarea 
                  placeholder="Расскажите о преимуществах, расположении, дополнительных услугах..." 
                  value={draft.description}
                  onChange={(e) => handleUpdate({ description: e.target.value })}
                  style={{ width: '100%', minHeight: '200px', padding: '1.5rem', borderRadius: '1.5rem', background: '#F9FAFB', border: '1px solid #E5E7EB', fontWeight: '500', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <div id="photos" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
            <div className={s.sectionCard}>
              <div className={s.sectionHeader}>
                <Camera size={24} color="#EC4899" strokeWidth={2.5} />
                <h2 className={s.sectionTitle}>Фотографии</h2>
              </div>
              <PropertyPhotosForm 
                images={draft.images} 
                onChange={(data) => handleUpdate(data)} 
              />
            </div>
          </div>

          {/* Footer Save Area */}
          <div className={s.footer}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 'bold' }}>Прогресс заполнения</p>
              <div style={{ width: '240px', height: '0.5rem', background: '#374151', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: '#2563EB' }} />
              </div>
            </div>
            <button 
              className={s.submitBtn}
              onClick={handlePublish}
              disabled={draft.isSubmitting}
            >
              {draft.isSubmitting ? (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 size={24} className={s.spinner} />
                    Отправка...
                 </div>
              ) : 'Опубликовать объект'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
