import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep } from '../../model/listingSlice';
import styles from '../ListingCreate.module.css';

export const Step1Type = () => {
  const dispatch = useDispatch();
  const type = useSelector((state: RootState) => state.listingCreate.type);

  const types = [
    { id: 'APARTMENT', label: 'Квартира', icon: '🏢' },
    { id: 'HOUSE', label: 'Дом', icon: '🏡' },
    { id: 'ROOM', label: 'Номер / Спальные места', icon: '🛌' },
  ];

  const handleSelect = (id: string) => {
    dispatch(updateDraft({ type: id as any }));
  };

  return (
    <div className={styles.innerContent}>
      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Какой тип жилья вы сдаете?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {types.map((t) => (
            <div
              key={t.id}
              className={`${styles.card} ${type === t.id ? styles.activeCard : ''}`}
              onClick={() => handleSelect(t.id)}
              style={{ border: type === t.id ? '2px solid #2563eb' : '2px solid #e5e7eb', background: type === t.id ? '#eff6ff' : 'white' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <button 
          className={`${styles.btnNext} ${type ? styles.btnNextActive : ''}`} 
          disabled={!type}
          onClick={() => dispatch(setStep(2))}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};
