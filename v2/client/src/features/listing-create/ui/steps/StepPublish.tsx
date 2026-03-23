import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../../app/store';
import { usePublishListingMutation } from '../../api/listingApi';
import { resetDraft } from '../../model/listingSlice';
import styles from '../ListingCreate.module.css';

export const StepPublish = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useSelector((state: RootState) => state.listingCreate);
  const [publish, { isLoading }] = usePublishListingMutation();
  const [showModal, setShowModal] = useState(false);

  const handlePublish = async () => {
    if (!id) return;
    try {
      await publish(id).unwrap();
      setShowModal(true);
    } catch (err) {
      console.error('Publish failed:', err);
    }
  };

  const handleClose = () => {
    dispatch(resetDraft());
    navigate('/dashboard');
  };

  return (
    <div className={styles.innerContent}>
      <div className={styles.card} style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚀</div>
        <h2 className={styles.sectionTitle}>Всё готово к публикации!</h2>
        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 32px auto' }}>
          Ваше объявление будет отправлено на модерацию. Мы проверим его в течение 24 часов и уведомим вас по электронной почте.
        </p>
        
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', display: 'grid', gap: '12px', textAlign: 'left', marginBottom: '32px' }}>
           <div style={{ display: 'flex', gap: '12px' }}>
             <span style={{ color: '#22c55e' }}>✓</span>
             <span>Все разделы заполнены</span>
           </div>
           <div style={{ display: 'flex', gap: '12px' }}>
             <span style={{ color: '#22c55e' }}>✓</span>
             <span>Фотографии загружены</span>
           </div>
           <div style={{ display: 'flex', gap: '12px' }}>
             <span style={{ color: '#22c55e' }}>✓</span>
             <span>Номера добавлены</span>
           </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <button
            className={`${styles.btnNext} ${styles.btnNextActive}`}
            disabled={isLoading}
            onClick={handlePublish}
          >
            {isLoading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '440px', textAlign: 'center', margin: 0 }}>
             <div style={{ fontSize: '48px', marginBottom: '20px' }}>🕐</div>
             <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Объявление отправлено на проверку</h3>
             <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
                Мы проверим ваш объект в течение суток и уведомим вас по email. <br/>
                Пока идёт модерация, вы можете продолжить заполнение информации.
             </p>
             <button 
               className={`${styles.btnNext} ${styles.btnNextActive}`} 
               style={{ width: '100%' }}
               onClick={handleClose}
             >
               Хорошо
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
