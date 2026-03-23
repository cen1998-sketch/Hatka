import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep, completeStep } from '../../model/listingSlice';
import { useUpdateStepMutation } from '../../api/listingApi';
import { ModerationHint } from '../../../../shared/ui/ModerationHint/ModerationHint';
import styles from '../ListingCreate.module.css';

const STREET_TYPES = ['ул.', 'пр.', 'пер.', 'бул.', 'наб.', 'ш.', 'туп.', 'аллея'];
const STARS = ['Без категории', '1 звезда', '2 звезды', '3 звезды', '4 звезды', '5 звёзд'];
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = (i % 2 === 0 ? '00' : '30');
  return `${h}:${m}`;
});
const YEARS = Array.from({ length: 2026 - 1900 }, (_, i) => (2025 - i).toString());

const AMENITY_GROUPS = [
  { name: 'Питание', items: ['Ресторан', 'Барная стойка', 'Доставка в номер', 'Детское меню'] },
  { name: 'Спорт', items: ['Фитнес-зал', 'Футбольное поле', 'Гольф', 'Теннисный корт'] },
  { name: 'Спа', items: ['Сауна', 'Спа-центр', 'Крытый бассейн', 'Бассейн с подогревом', 'Открытый бассейн', 'Джакузи', 'Банный чан'] },
  { name: 'Удобства', items: ['Лифт', 'Прачечная', 'Круглосуточная стойка регистрации', 'Пандус', 'Камера хранения'] },
  { name: 'Для детей', items: ['Аквапарк', 'Детский бассейн', 'Игровая площадка', 'Няня', 'Анимация'] },
  { name: 'На территории', items: ['Сад', 'Собственный пляж', 'Терраса'] },
  { name: 'Для работы', items: ['Конференц-зал', 'Бизнес-центр', 'Переговорная'] },
];

export const Step2MainInfo = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.listingCreate);
  const { title, streetType, streetName, houseNumber, building, details, description, amenities, moderationDetails } = draft;
  const [updateStepApi] = useUpdateStepMutation();
  const [showErrors, setShowErrors] = useState(false);

  const update = (fields: any) => dispatch(updateDraft(fields));
  const updateDetails = (fields: any) => dispatch(updateDraft({ details: { ...details, ...fields } }));

  const handleAmenityToggle = (item: string) => {
    const newAmenitiesList = amenities.includes(item)
      ? amenities.filter(a => a !== item)
      : [...amenities, item];
    update({ amenities: newAmenitiesList });
  };

  const isValid = !!title && !!streetType && !!streetName && !!houseNumber;

  const handleNext = async () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    try {
      if (draft.id) {
        await updateStepApi({
          id: draft.id,
          step: 2,
          data: {
            title,
            streetType,
            streetName,
            houseNumber,
            building: building || undefined,
            details,
            description: description || '',
            amenities
          }
        }).unwrap();
        dispatch(completeStep(2));
        dispatch(setStep(3));
      }
    } catch (err: any) {
      console.error('Failed to save step 2:', err);
      if (err.data?.error) {
        console.warn('Validation error details:', JSON.stringify(err.data.error, null, 2));
      }
    }
  };

  return (
    <div className={styles.innerContent}>
      {/* Раздел: Название отеля */}
      <ModerationHint error={moderationDetails?.basics}>
        <section id="name" className={styles.card}>
          <h2 className={styles.sectionTitle}>Название отеля</h2>
          <input 
            className={`${styles.input} ${showErrors && !title ? styles.inputError : ''}`} 
            placeholder="Название отеля" 
            value={title || ''}
            maxLength={70}
            onChange={(e) => {
              update({ title: e.target.value });
              if (e.target.value) setShowErrors(false);
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <p className={styles.footerText} style={{ textAlign: 'left', margin: 0 }}>
              Это название будут видеть гости при поиске
            </p>
            <span style={{ fontSize: '12px', color: (title?.length || 0) >= 70 ? '#ef4444' : '#64748b' }}>
              {title?.length || 0} / 70
            </span>
          </div>
        </section>
      </ModerationHint>

      {/* Раздел: Адрес */}
      <ModerationHint error={moderationDetails?.location}>
        <section id="address" className={styles.card}>
          <h2 className={styles.sectionTitle}>Адрес</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className={styles.label}>Тип улицы</label>
              <select 
                className={`${styles.select} ${showErrors && !streetType ? styles.inputError : ''}`} 
                value={streetType || ''}
                onChange={(e) => update({ streetType: e.target.value })}
              >
                <option value="">Выберите</option>
                {STREET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={styles.label}>Название улицы</label>
              <input 
                className={`${styles.input} ${showErrors && !streetName ? styles.inputError : ''}`} 
                value={streetName || ''}
                onChange={(e) => update({ streetName: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Дом</label>
              <input 
                className={`${styles.input} ${showErrors && !houseNumber ? styles.inputError : ''}`} 
                value={houseNumber || ''}
                onChange={(e) => update({ houseNumber: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Корпус (необязательно)</label>
              <input 
                className={styles.input} 
                value={building || ''}
                onChange={(e) => update({ building: e.target.value })}
              />
            </div>
          </div>
          {showErrors && (!streetType || !streetName || !houseNumber) && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '16px' }}>
              Пожалуйста, заполните обязательные поля адреса
            </p>
          )}
        </section>
      </ModerationHint>

      {/* Раздел: Тип и категория */}
      <section id="registry" className={styles.card}>
        <h2 className={styles.sectionTitle}>Тип и категория средства размещения</h2>
        <div style={{ marginBottom: '16px' }}>
          <label className={styles.label}>Номер реестровой записи</label>
          <input 
            className={styles.input} 
            value={details.registryNumber || ''}
            onChange={(e) => updateDetails({ registryNumber: e.target.value })}
          />
        </div>
        <div>
          <label className={styles.label}>Категория средства размещения (звезды)</label>
          <select 
            className={styles.select} 
            value={details.starsCategory || ''}
            onChange={(e) => updateDetails({ starsCategory: e.target.value })}
          >
            {STARS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {/* Раздел: Сведения */}
      <section id="svedeniya" className={styles.card}>
        <h2 className={styles.sectionTitle}>Сведения</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className={styles.label}>Год постройки</label>
            <select 
              className={styles.select} 
              value={details.yearBuilt || ''}
              onChange={(e) => updateDetails({ yearBuilt: e.target.value })}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>Количество номеров</label>
            <input 
              type="number" 
              className={styles.input} 
              value={details.roomCount || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateDetails({ roomCount: isNaN(val) ? 0 : val });
              }}
            />
          </div>
        </div>
      </section>

      {/* Раздел: Заезд и выезд */}
      <section id="rules" className={styles.card}>
        <h2 className={styles.sectionTitle}>Заезд и выезд</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className={styles.label}>Заезд после</label>
            <select 
              className={styles.select} 
              value={details.checkIn || '14:00'}
              onChange={(e) => updateDetails({ checkIn: e.target.value })}
            >
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>Выезд до</label>
            <select 
              className={styles.select} 
              value={details.checkOut || '12:00'}
              onChange={(e) => updateDetails({ checkOut: e.target.value })}
            >
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Раздел: Удобства и услуги */}
      <ModerationHint error={moderationDetails?.amenities}>
        <section id="amenities" className={styles.card}>
          <h2 className={styles.sectionTitle}>Удобства и услуги</h2>
          {AMENITY_GROUPS.map(group => (
            <div key={group.name} style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#64748b' }}>{group.name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.items.map(item => (
                  <div 
                    key={item} 
                    className={`${styles.typeCard} ${amenities.includes(item) ? styles.typeCardActive : ''}`}
                    style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}
                    onClick={() => handleAmenityToggle(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </ModerationHint>

      {/* Раздел: Описание объекта */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Описание объекта</h2>
        <textarea 
          className={styles.input} 
          style={{ minHeight: '150px' }}
          placeholder="Расскажите подробнее о своём объекте"
          value={description || ''}
          onChange={(e) => update({ description: e.target.value.slice(0, 3000) })}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <p className={styles.footerText} style={{ textAlign: 'left', margin: 0 }}>
             Минимум 200 символов для лучшего результата.
          </p>
          <span style={{ fontSize: '12px', color: (description?.length || 0) < 200 ? '#ef4444' : '#64748b' }}>
            {description?.length || 0} / 3000
          </span>
        </div>
      </section>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Нажимая кнопку «Далее» вы подтверждаете согласие с условиями оферты.
          </p>
          <button
            className={`${styles.btnNext} ${styles.btnNextActive}`}
            onClick={handleNext}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};
