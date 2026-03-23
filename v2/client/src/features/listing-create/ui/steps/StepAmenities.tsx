import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep } from '../../model/listingSlice';
import styles from '../ListingCreate.module.css';

const amenityCategories = [
  {
    title: 'Базовые удобства',
    items: [
      { id: 'wifi', label: 'Wi-Fi' },
      { id: 'ac', label: 'Кондиционер' },
      { id: 'washer', label: 'Стиральная машина' },
      { id: 'heating', label: 'Отопление' },
      { id: 'workspace', label: 'Рабочая зона' },
    ]
  },
  {
    title: 'Кухня',
    items: [
      { id: 'fridge', label: 'Холодильник' },
      { id: 'stove', label: 'Плита' },
      { id: 'microwave', label: 'Микроволновка' },
      { id: 'dishwasher', label: 'Посудомоечная машина' },
    ]
  },
  {
    title: 'Развлечения и вид',
    items: [
      { id: 'tv', label: 'Телевизор' },
      { id: 'books', label: 'Книги' },
      { id: 'lake_view', label: 'Вид на озеро' },
      { id: 'city_view', label: 'Вид на город' },
    ]
  }
];

export const StepAmenities = () => {
  const dispatch = useDispatch();
  const { amenities } = useSelector((state: RootState) => state.listingCreate);

  const toggleAmenity = (id: string) => {
    const list = amenities || [];
    const newList = list.includes(id) 
      ? list.filter(a => a !== id) 
      : [...list, id];
    dispatch(updateDraft({ amenities: newList }));
  };

  return (
    <div className={styles.innerContent}>
      <div className={styles.card}>
        <h2 className={styles.stepTitle}>Удобства</h2>
        
        {amenityCategories.map((cat) => (
          <div key={cat.title} style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#4b5563' }}>{cat.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.typeCard} ${amenities?.includes(item.id) ? styles.typeCardActive : ''}`}
                  onClick={() => toggleAmenity(item.id)}
                  style={{ padding: '12px 20px' }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', width: '100%' }}>
                    <input 
                      type="checkbox" 
                      checked={amenities?.includes(item.id)} 
                      onChange={() => {}} // Controlled by div onClick
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={() => dispatch(setStep(5))}>Назад</button>
        <button 
          className={`${styles.btnNext} ${styles.btnNextActive}`}
          onClick={() => dispatch(setStep(7))}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
