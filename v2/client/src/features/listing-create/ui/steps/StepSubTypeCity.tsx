import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep } from '../../model/listingSlice';
import { LocationSuggest } from '../../../location-suggest';
import styles from '../ListingCreate.module.css';

const hotelSubTypes = [
  { id: 'ГОСТИНИЦА', label: 'Гостиница' },
  { id: 'АПАРТАМЕНТ', label: 'Апартамент' },
  { id: 'БАЗА_ОТДЫХА', label: 'База отдыха' },
  { id: 'ЭКО_ОТЕЛЬ', label: 'Эко-отель' },
  { id: 'ОТЕЛЬ', label: 'Отель' },
  { id: 'АПАРТ_ОТЕЛЬ', label: 'Апарт-отель' },
  { id: 'ГОСТЕВОЙ_ДОМ', label: 'Гостевой дом' },
  { id: 'ПАРК_ОТЕЛЬ', label: 'Парк-отель' },
  { id: 'БУТИК_ОТЕЛЬ', label: 'Бутик-отель' },
  { id: 'ХОСТЕЛ', label: 'Хостел' },
  { id: 'КЕМПИНГ', label: 'Кемпинг' },
  { id: 'ПАНСИОНАТ', label: 'Пансионат' },
  { id: 'МИНИ_ГОСТИНИЦА', label: 'Мини-гостиница' },
  { id: 'КАПСУЛЬНЫЙ_ОТЕЛЬ', label: 'Капсульный отель' },
  { id: 'ГЛЭМПИНГ', label: 'Глэмпинг' },
  { id: 'САНАТОРИЙ', label: 'Санаторий' },
  { id: 'ОТЕЛЬ_ЭКОНОМ_КЛАССА', label: 'Отель эконом-класса' },
  { id: 'ПАЛОМНИЧЕСКИЙ_ОТЕЛЬ', label: 'Паломнический отель' },
];

export const StepSubTypeCity = () => {
  const dispatch = useDispatch();
  const { details, city } = useSelector((state: RootState) => state.listingCreate);
  const selectedType = details?.hotelType;

  const handleTypeSelect = (id: string) => {
    dispatch(updateDraft({ details: { ...details, hotelType: id } }));
  };

  const handleCityChange = (val: string) => {
    dispatch(updateDraft({ city: val }));
  };

  const isValid = !!selectedType && !!city;

  return (
    <div className={styles.innerContent}>
      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Выберите заголовок объявления:</h2>
        <div className={styles.typeGrid}>
          {hotelSubTypes.map((type) => (
            <div
              key={type.id}
              className={`${styles.typeCard} ${selectedType === type.id ? styles.typeCardActive : ''}`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <div className={`${styles.radioCircle} ${selectedType === type.id ? styles.radioCircleActive : ''}`}>
                {selectedType === type.id && <div className={styles.radioInner} />}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{type.label}</span>
            </div>
          ))}
        </div>

        <h2 className={styles.stepTitle}>Укажите местоположение объекта:</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: 600, color: '#64748b' }}>Город</span>
          <div style={{ flex: 1 }}>
            <LocationSuggest value={city || ''} onChange={handleCityChange} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={() => dispatch(setStep(1))}>Назад</button>
        <button
          className={`${styles.btnNext} ${isValid ? styles.btnNextActive : ''}`}
          disabled={!isValid}
          onClick={() => dispatch(setStep(3))}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};
