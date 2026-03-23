import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep } from '../../model/listingSlice';
import styles from '../ListingCreate.module.css';

export const Step2Address = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.listingCreate);

  const streetTypes = ['ул.', 'пр-кт', 'пер.', 'б-р', 'ш.', 'наб.', 'пл.'];

  const handleBack = () => dispatch(setStep(2));
  const handleNext = () => dispatch(setStep(4));

  const isFormValid = !!draft.streetName && !!draft.houseNumber;

  return (
    <div className={styles.innerContent}>
      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Адрес</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Тип улицы</label>
            <select
              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}
              value={draft.streetType || 'ул.'}
              onChange={(e) => dispatch(updateDraft({ streetType: e.target.value }))}
            >
              {streetTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Название улицы</label>
            <input
              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}
              placeholder="Введите название"
              value={draft.streetName || ''}
              onChange={(e) => dispatch(updateDraft({ streetName: e.target.value }))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Дом</label>
            <input
              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}
              placeholder="Номер дома"
              value={draft.houseNumber || ''}
              onChange={(e) => dispatch(updateDraft({ houseNumber: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Корпус</label>
            <input
              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}
              placeholder="Буква или число"
              value={draft.building || ''}
              onChange={(e) => dispatch(updateDraft({ building: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={handleBack}>Назад</button>
        <button 
          className={`${styles.btnNext} ${isFormValid ? styles.btnNextActive : ''}`}
          disabled={!isFormValid}
          onClick={handleNext}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
