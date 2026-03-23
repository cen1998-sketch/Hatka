import React, { useState } from 'react';
import { useGetMyListingsQuery } from '../../api/listingApi';
import commonStyles from '../ListingCreate.module.css';
import styles from './StepRoomsCategory.module.css';
import { CheckCircle2, Building2, Plus, ArrowRight } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';

const ROOM_TYPES = [
  { id: 'SNGL', label: 'одноместный (SNGL)' },
  { id: 'DBL', label: 'двухместный номер с 1 кроватью (DBL)' },
  { id: 'TWIN', label: 'двухместный номер с 2 отдельными кроватями (TWIN)' },
  { id: 'TRIPLE', label: 'трехместный (TRIPLE)' },
  { id: 'QUAD', label: 'четырехместный' },
  { id: 'FAMILY', label: 'семейный (FAMILY)' },
  { id: 'MIXED', label: 'многоместный смешанный' },
  { id: 'APARTMENT', label: 'апартамент' },
  { id: 'HOUSE', label: 'отдельный дом' },
  { id: 'ROOM', label: 'комната' },
];

interface Props {
  onSelectNew: (type: string) => void;
  onSelectExisting: (id: string) => void;
}

export const StepRoomsCategory = ({ onSelectNew, onSelectExisting }: Props) => {
  const [mode, setMode] = useState<'NEW' | 'EXISTING'>('NEW');
  const [selectedType, setSelectedType] = useState('');
  const [showError, setShowError] = useState(false);
  
  const { data: myListingsData } = useGetMyListingsQuery();
  const myListings = (myListingsData?.data || []).filter((l: any) => l.type !== 'HOTEL');

  const handleContinue = () => {
    if (mode === 'NEW') {
      if (!selectedType) {
        setShowError(true);
        return;
      }
      onSelectNew(selectedType);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/80x60?text=No+Photo';
    if (url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.title}>Категории номеров</h2>
      <p className={styles.description}>
        Добавьте новую категорию или выберите готовый объект, чтобы сделать его категорией номера в этом отеле.
      </p>

      <div className={styles.optionGrid}>
        {/* Option: Add New */}
        <div 
          onClick={() => setMode('NEW')} 
          className={cn(styles.optionCard, mode === 'NEW' && styles.optionCardActive)}
        >
          <div className={styles.iconBox}>
            <Plus size={24} />
          </div>
          <div className={styles.optionInfo}>
            <div className={styles.optionHeader}>
              <span className={styles.optionTitle}>Добавить новую категорию</span>
              {mode === 'NEW' && <CheckCircle2 size={20} className="text-[#3E5CDE]" />}
            </div>
            <p className={styles.optionSubtext}>Создайте описание комнаты с нуля</p>
            
            {mode === 'NEW' && (
              <div className={styles.formArea}>
                <label className={styles.label}>Тип категории:</label>
                <select 
                  className={styles.select}
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setShowError(false);
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">- выберите подходящий вариант -</option>
                  {ROOM_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                {showError && (
                  <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>
                    Выберите один из предложенных вариантов
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Option: Existing Objects */}
        <div 
          onClick={() => setMode('EXISTING')} 
          className={cn(styles.optionCard, mode === 'EXISTING' && styles.optionCardActive)}
        >
          <div className={styles.iconBox}>
            <Building2 size={24} />
          </div>
          <div className={styles.optionInfo}>
            <div className={styles.optionHeader}>
              <span className={styles.optionTitle}>Выбрать из моих объектов</span>
              {mode === 'EXISTING' && <CheckCircle2 size={20} className="text-[#3E5CDE]" />}
            </div>
            <p className={styles.optionSubtext}>Привяжите существующий апартамент или дом</p>

            {mode === 'EXISTING' && (
              <div className={styles.listingList}>
                {myListings.length === 0 ? (
                  <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#F8FAFC', color: '#94A3B8', fontSize: '13px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                    У вас нет других объектов для привязки
                  </div>
                ) : myListings.map((listing: any) => (
                  <div 
                    key={listing.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExisting(listing.id);
                    }}
                    className={styles.listingItem}
                  >
                    <img 
                      src={getImageUrl(listing.photos?.[0]?.url || listing.photos?.[0])} 
                      alt="" 
                      className={styles.listingImage}
                    />
                    <div className={styles.listingInfo}>
                      <h4 className={styles.listingTitle}>
                        {(listing.title || '').length > 50 ? `${listing.title.slice(0, 50)}...` : (listing.title || 'Без названия')}
                      </h4>
                      <p className={styles.listingMeta}>
                        {listing.city}{listing.streetName ? `, ${listing.streetName}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center pr-1 transition-transform group-hover:translate-x-1">
                      <ArrowRight size={18} className="text-[#3E5CDE]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tipBox}>
        <p className={styles.tipText}>
           После того, как вы введёте данные об одной категории номеров, вы сможете добавить информацию о других, вернувшись в этот шаг.
        </p>
      </div>
      
      {mode === 'NEW' && (
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <button 
            className={cn(commonStyles.btnNext, commonStyles.btnNextActive)}
            style={{ width: 'auto', paddingLeft: '48px', paddingRight: '48px', height: '56px' }}
            onClick={handleContinue}
          >
            Продолжить
          </button>
        </div>
      )}
    </div>
  );
};
