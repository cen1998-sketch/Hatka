import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { 
  useUpdateRoomMutation,
} from '../../api/listingApi';
import commonStyles from '../ListingCreate.module.css';
import styles from './RoomEditor.module.css';
import { PhotoUploader } from './PhotoUploader';
import { 
  Bed, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  Settings, 
  Image as ImageIcon, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';
import { ModerationHint } from '../../../../shared/ui/ModerationHint/ModerationHint';

const ROOM_TYPES = [
  'одноместный (SNGL)',
  'двухместный номер с 1 кроватью (DBL)',
  'двухместный номер с 2 отдельными кроватями (TWIN)',
  'трехместный (TRIPLE)',
  'четырехместный',
  'семейный (FAMILY)',
  'многоместный смешанный',
  'апартамент',
  'отдельный дом',
  'комната'
];

const AMENITY_GROUPS = [
  { 
    title: 'Основные', 
    items: ['Кондиционер', 'Телевизор', 'Холодильник', 'Сейф', 'Рабочий стол', 'Гардероб'] 
  },
  { 
    title: 'Ванная комната', 
    items: ['Ванна', 'Душ', 'Фен', 'Халаты', 'Тапочки', 'Полотенца', 'Бесплатные туалетные принадлежности'] 
  },
  { 
    title: 'Кухня и еда', 
    items: ['Мини-бар', 'Чайник', 'Кофемашина', 'Микроволновая печь', 'Посуда'] 
  },
  { 
    title: 'Вид и балкон', 
    items: ['Балкон', 'Терраса', 'Вид на море', 'Вид на горы', 'Вид на город'] 
  }
];

const BED_TYPES = ['Односпальная', 'Двуспальная', 'Кинг-сайз', 'Двухъярусная', 'Диван-кровать'];

const ANCHORS = [
  { id: 'description', label: 'Описание и цены' },
  { id: 'amenities', label: 'Удобства номера' },
  { id: 'photos', label: 'Фото' },
  { id: 'booking', label: 'Настройки бронирования' }
];

export const RoomForm = ({ room, initialData, onBack }: { room?: any, initialData?: any, onBack: () => void }) => {
  const { id: listingId } = useSelector((state: RootState) => state.listingCreate);
  const [updateRoom] = useUpdateRoomMutation();
  const [activeAnchor, setActiveAnchor] = useState('description');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: room?.title || initialData?.title || '',
    type: room?.type || initialData?.type || 'двухместный номер с 1 кроватью (DBL)',
    area: room?.area || 20,
    capacityAdults: room?.capacityAdults || 2,
    capacityChildren: room?.capacityChildren || 0,
    pricePerDay: room?.pricePerDay || 3500,
    priceLongTerm: room?.priceLongTerm || 0,
    instantBooking: room?.instantBooking ?? true,
    quantity: room?.quantity || 1,
    amenities: room?.amenities || [],
    beds: room?.beds || [{ type: 'Двуспальная', count: 1 }],
    photos: room?.photos || []
  });

  // Debounced Auto-save
  useEffect(() => {
    if (!room?.id) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateRoom({ roomId: room.id, data: formData }).unwrap();
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, room?.id, updateRoom]);

  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveAnchor(id);
    }
  };

  const handleBedChange = (index: number, field: string, value: any) => {
    const newBeds = [...formData.beds];
    newBeds[index] = { ...newBeds[index], [field]: value };
    setFormData({ ...formData, beds: newBeds });
  };

  const addBed = () => {
    setFormData({ ...formData, beds: [...formData.beds, { type: 'Односпальная', count: 1 }] });
  };

  const removeBed = (index: number) => {
    setFormData({ ...formData, beds: formData.beds.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className={styles.roomEditor}>
      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Редактирование номера</div>
        <ul className={styles.anchorList}>
          {ANCHORS.map(anchor => (
            <li 
              key={anchor.id}
              className={cn(styles.anchorItem, activeAnchor === anchor.id && styles.anchorItemActive)}
              onClick={() => scrollToAnchor(anchor.id)}
            >
              <div className="flex items-center gap-3">
                {anchor.id === 'description' && <Info size={16} />}
                {anchor.id === 'amenities' && <Settings size={16} />}
                {anchor.id === 'photos' && <ImageIcon size={16} />}
                {anchor.id === 'booking' && <CheckCircle2 size={16} />}
                {anchor.label}
              </div>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => window.open(`/listing/${listingId}/preview`, '_blank')} 
          className={commonStyles.backToListBtn}
          style={{ 
            marginTop: '32px', 
            width: '100%', 
            justifyContent: 'center',
            padding: '14px',
            border: '1px solid #3E5CDE',
            backgroundColor: '#F0F4FF',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#3E5CDE'
          }}
        >
          Предпросмотр
        </button>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        {/* Section 1: Description & Pricing */}
        <section id="description" className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Описание и цены</h2>
          <div className={styles.grid}>
            <ModerationHint error={room?.moderationDetails?.basics}>
              <div>
                <label className={styles.label}>Название категории для гостей</label>
                <input 
                  className={styles.input} 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="например: Двухместный номер Делюкс"
                />
              </div>
            </ModerationHint>
            
            <div className={styles.row}>
              <div>
                <label className={styles.label}>Тип категории</label>
                <select 
                  className={styles.select} 
                  value={formData.type} 
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={styles.label}>Площадь (м²)</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  value={formData.area} 
                  onChange={e => setFormData({ ...formData, area: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <ModerationHint error={room?.moderationDetails?.description}>
              <div className={styles.row}>
                <div>
                  <label className={styles.label}>Цена за сутки (₽)</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    value={formData.pricePerDay} 
                    onChange={e => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={styles.label}>Количество таких номеров</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    value={formData.quantity} 
                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </ModerationHint>

            <div>
              <label className={styles.label}>Вместимость (взрослых / детей)</label>
              <div className={styles.row}>
                <input 
                  type="number" 
                  className={styles.input} 
                  placeholder="Взрослых"
                  value={formData.capacityAdults} 
                  onChange={e => setFormData({ ...formData, capacityAdults: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  className={styles.input} 
                  placeholder="Детей"
                  value={formData.capacityChildren} 
                  onChange={e => setFormData({ ...formData, capacityChildren: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Спальные места</label>
              <div className="flex flex-col gap-3">
                {formData.beds.map((bed: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <select 
                        className={styles.select} 
                        value={bed.type} 
                        onChange={e => handleBedChange(idx, 'type', e.target.value)}
                      >
                        {BED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ width: '100px' }}>
                       <input 
                        type="number" 
                        className={styles.input} 
                        value={bed.count} 
                        onChange={e => handleBedChange(idx, 'count', parseInt(e.target.value))}
                      />
                    </div>
                    <button 
                      onClick={() => removeBed(idx)} 
                      className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button onClick={addBed} style={{ color: '#2563eb', padding: '8px', border: '1px dashed #2563eb', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  + Добавить спальное место
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Amenities */}
        <section id="amenities" className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Удобства номера</h2>
          <ModerationHint error={room?.moderationDetails?.amenities}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {AMENITY_GROUPS.map(group => (
                <div key={group.title}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#475569' }}>{group.title}</h3>
                  <div className={styles.amenityGrid}>
                    {group.items.map(item => {
                      const isActive = formData.amenities.includes(item);
                      return (
                        <div 
                          key={item} 
                          className={`${styles.amenityItem} ${isActive ? styles.amenityItemActive : ''}`}
                          onClick={() => {
                            const list = isActive 
                              ? formData.amenities.filter((a: string) => a !== item)
                              : [...formData.amenities, item];
                            setFormData({ ...formData, amenities: list });
                          }}
                        >
                          <div className={`${commonStyles.radioCircle} ${isActive ? commonStyles.radioCircleActive : ''}`} style={{ width: '18px', height: '18px' }}>
                            {isActive && <div className={commonStyles.radioInner} style={{ width: '10px', height: '10px' }} />}
                          </div>
                          <span style={{ fontSize: '14px' }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ModerationHint>
        </section>

        {/* Section 3: Photos */}
        <section id="photos" className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Фото</h2>
          <ModerationHint error={room?.moderationDetails?.photos}>
            <PhotoUploader 
              listingId={listingId || ''} 
              roomId={room?.id || ''} 
              initialPhotos={formData.photos}
              onPhotosChange={(photos) => setFormData({ ...formData, photos })}
            />
          </ModerationHint>
        </section>

        {/* Section 4: Booking Settings */}
        <section id="booking" className={styles.sectionCard} style={{ marginBottom: '120px' }}>
          <h2 className={styles.sectionTitle}>Настройки бронирования</h2>
          <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Мгновенное бронирование</div>
              <div style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Гости могут бронировать без вашего подтверждения</div>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={formData.instantBooking}
                onChange={() => setFormData({ ...formData, instantBooking: !formData.instantBooking })}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <button 
            className={cn(commonStyles.btnNext, commonStyles.btnNextActive)} 
            onClick={onBack}
            style={{ width: '100%' }}
          >
            Сохранить и продолжить
          </button>
        </div>
      </div>

      {/* Auto-save Status Indicator */}
      {isSaving && (
        <div className={styles.autosaveStatus}>
          Сохранение...
        </div>
      )}
    </div>
  );
};
