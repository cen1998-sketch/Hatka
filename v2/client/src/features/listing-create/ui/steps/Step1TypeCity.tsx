import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { updateDraft, setStep, completeStep } from '../../model/listingSlice';
import { LocationSuggest } from '../../../location-suggest';
import { useCreateListingMutation, useUpdateStepMutation } from '../../api/listingApi';
import { ModerationHint } from '../../../../shared/ui/ModerationHint/ModerationHint';
import styles from '../ListingCreate.module.css';

const TYPES = ['Гостиница', 'Отель', 'Бутик-отель', 'Мини-гостиница', 'Апартамент', 'Апарт-отель', 'Хостел', 'Капсульный отель', 'База отдыха', 'Эко-отель', 'Гостевой дом', 'Кемпинг', 'Глэмпинг', 'Паломнический отель', 'Парк-отель', 'Пансионат', 'Санаторий'];

const TYPE_MAP: Record<string, string> = {
  'Гостиница': 'HOTEL_ROOM',
  'Отель': 'HOTEL_ROOM',
  'Бутик-отель': 'HOTEL_ROOM',
  'Мини-гостиница': 'HOTEL_ROOM',
  'Апартамент': 'APARTMENT',
  'Апарт-отель': 'APARTMENT',
  'Хостел': 'HOTEL_ROOM',
  'Капсульный отель': 'HOTEL_ROOM',
  'База отдыха': 'HOUSE',
  'Эко-отель': 'HOTEL_ROOM',
  'Гостевой дом': 'HOUSE',
  'Кемпинг': 'HOUSE',
  'Глэмпинг': 'HOUSE',
  'Паломнический отель': 'HOTEL_ROOM',
  'Парк-отель': 'HOTEL_ROOM',
  'Пансионат': 'HOTEL_ROOM',
  'Санаторий': 'HOTEL_ROOM'
};

export const Step1TypeCity = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.listingCreate);
  const { type, city, moderationDetails } = draft;
  const [createListing] = useCreateListingMutation();
  const [updateStep] = useUpdateStepMutation();
  const [showErrors, setShowErrors] = useState(false);

  const update = (fields: any) => dispatch(updateDraft(fields));

  const isValid = !!city;

  const handleNext = async () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    try {
      const mappedType = TYPE_MAP[type as string] || 'HOTEL_ROOM';
      
      let listingId = draft.id;

      if (!listingId) {
        // Create initial listing with proper Enum type
        const result = await createListing({ type: mappedType as any }).unwrap();
        listingId = result.data.id;
        // The create result might already have some data, but let's be sure
        dispatch(updateDraft({ id: listingId }));
      }

      await updateStep({ 
        id: listingId!, 
        step: 1, 
        data: { 
          city,
          details: { hotelType: type } 
        } 
      }).unwrap();
      
      dispatch(completeStep(1));
      dispatch(setStep(2));
    } catch (err) {
      console.error('Failed to save step 1:', err);
    }
  };

  return (
    <div className={styles.innerContent}>
      <ModerationHint error={moderationDetails?.location || moderationDetails?.basics}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Тип недвижимости и город</h2>
          
          <div style={{ marginBottom: '32px' }}>
            <label className={styles.label}>Выберите тип:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {TYPES.map(t => (
                <div 
                  key={t} 
                  className={`${styles.typeCard} ${type === t ? styles.typeCardActive : ''}`}
                  onClick={() => update({ type: t })}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={styles.label}>Город:</label>
            <div className={showErrors && !city ? styles.inputError : ''}>
              <LocationSuggest 
                value={city || ''} 
                onChange={(val) => {
                  update({ city: val });
                  if (val) setShowErrors(false);
                }} 
                variant="light"
              />
            </div>
            {showErrors && !city && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>
                Пожалуйста, выберите город из списка
              </p>
            )}
          </div>
        </div>
      </ModerationHint>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
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
