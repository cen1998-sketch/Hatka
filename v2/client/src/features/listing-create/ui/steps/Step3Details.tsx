import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep } from '../../model/listingSlice';
import styles from '../ListingCreate.module.css';

export const Step3Details = () => {
  const dispatch = useDispatch();
  const { title, details } = useSelector((state: RootState) => state.listingCreate);

  const starOptions = ['выберите', 'без звезд', '1 звезда', '2 звезды', '3 звезды', '4 звезды', '5 звезд'];

  const handleBack = () => dispatch(setStep(3));
  const handleNext = () => dispatch(setStep(5));

  const updateDetails = (fields: any) => {
    dispatch(updateDraft({ details: { ...details, ...fields } }));
  };

  return (
    <div className={styles.innerContent}>
      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Название отеля</h2>
        <input
          style={{ width: '100%', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '8px' }}
          placeholder="Например: Отель Марриотт"
          value={title || ''}
          onChange={(e) => dispatch(updateDraft({ title: e.target.value }))}
        />
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          это название будут видеть гости при поиске (если у вас нет названия, можете указать название улицы, номер дома)
        </p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Тип и категория средства размещения</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          Внесите информацию о вашем объекте из <a href="#" style={{ color: '#2563eb' }}>Единого реестра</a>.<br />
          После успешной проверки мы разместим эти данные для гостей
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 500 }}>Номер реестровой записи*</label>
          <input
            style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}
            value={details?.registryNumber || ''}
            onChange={(e) => updateDetails({ registryNumber: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 500 }}>Категория средства размещения (звезды)</label>
          <select
            style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}
            value={details?.starsCategory || 'выберите'}
            onChange={(e) => updateDetails({ starsCategory: e.target.value })}
          >
            {starOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 500 }}>Тип средства размещения (по реестру)</label>
          <input
            style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px' }}
            value={details?.registryType || ''}
            onChange={(e) => updateDetails({ registryType: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Интернет</h2>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Услуга, на которую чаще всего обращают внимание гости при поиске...
        </p>
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={!!details?.hasInternet} 
              onChange={(e) => updateDetails({ hasInternet: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ fontWeight: 500 }}>Бесплатный Wi-Fi на всей территории</span>
          </label>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={handleBack}>Назад</button>
        <button 
          className={`${styles.btnNext} ${details?.registryNumber ? styles.btnNextActive : ''}`}
          disabled={!details?.registryNumber}
          onClick={handleNext}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
