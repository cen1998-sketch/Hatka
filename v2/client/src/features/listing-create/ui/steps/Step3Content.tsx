import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep } from '../../model/listingSlice';
import styles from '../ListingCreate.module.css';

export const Step3Content = () => {
  const dispatch = useDispatch();
  const { title, description } = useSelector((state: RootState) => state.listingCreate);

  const titleCount = title?.length || 0;
  const descCount = description?.length || 0;

  const handleBack = () => dispatch(setStep(6));
  const handleNext = () => dispatch(setStep(8));

  return (
    <div className={styles.innerContent}>
      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Заголовок и описание</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>Название объявления</label>
            <span style={{ fontSize: '12px', color: titleCount >= 10 ? '#10B981' : '#EF4444' }}>
              {titleCount} / 10 символов минимум
            </span>
          </div>
          <input 
            style={{ width: '100%', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}
            placeholder="Например: Светлая евродвушка с видом на парк" 
            value={title || ''}
            onChange={(e) => dispatch(updateDraft({ title: e.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>Описание жилья</label>
            <span style={{ fontSize: '12px', color: descCount >= 50 ? '#10B981' : '#EF4444' }}>
              {descCount} / 50 символов минимум
            </span>
          </div>
          <textarea 
            placeholder="Подробно опишите ваше жильё, его преимущества и окрестности..." 
            value={description || ''}
            onChange={(e) => dispatch(updateDraft({ description: e.target.value }))}
            style={{ 
              width: '100%', minHeight: '180px', padding: '16px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', outline: 'none', resize: 'vertical' 
            }}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={handleBack}>Назад</button>
        <button 
          className={`${styles.btnNext} ${titleCount >= 10 && descCount >= 50 ? styles.btnNextActive : ''}`}
          disabled={titleCount < 10 || descCount < 50}
          onClick={handleNext}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
