import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../../app/store.ts'
import { updateDraft, setStep, resetDraft } from '../../model/listingSlice'
import { useCreateListingMutation } from '../../api/listingApi'
import { useNavigate } from 'react-router-dom'
import styles from '../ListingCreate.module.css'

export const Step5Price = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const draft = useSelector((state: RootState) => state.listingCreate)
  const [createListing, { isLoading }] = useCreateListingMutation()

  const handleFinish = async () => {
    try {
      await createListing({
        type: draft.type,
        title: draft.title,
        description: draft.description,
        city: draft.city,
        address: `${draft.streetName}, ${draft.houseNumber}`,
        pricePerDay: draft.pricePerDay,
        amenities: draft.amenities,
        details: draft.details,
      }).unwrap()
      
      alert('Объявление успешно создано!')
      dispatch(resetDraft())
      navigate('/dashboard')
    } catch (e) {
      alert('Ошибка при создании объявления. Проверьте правильность заполнения всех полей.')
    }
  }

  const handleBack = () => dispatch(setStep(4))

  const isFormValid = !!draft.title && !!draft.description && !!draft.pricePerDay && draft.pricePerDay > 0

  return (
    <div>
      <h2 className={styles.title}>Последний шаг: цена и описание</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>Заголовок объявления</label>
          <input
            value={draft.title || ''}
            placeholder="Например: Уютная студия в центре"
            onChange={(e) => dispatch(updateDraft({ title: e.target.value }))}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>Описание</label>
          <textarea
            value={draft.description || ''}
            placeholder="Опишите ваше жилье подробно..."
            onChange={(e) => dispatch(updateDraft({ description: e.target.value }))}
            style={{ width: '100%', minHeight: '120px', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', resize: 'vertical', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>Цена за сутки (₽)</label>
          <input
            type="number"
            value={draft.pricePerDay || ''}
            placeholder="0"
            onChange={(e) => dispatch(updateDraft({ pricePerDay: Number(e.target.value) }))}
            style={{ width: '200px', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', outline: 'none' }}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={handleBack}>Назад</button>
        <button 
          className={styles.btnNext} 
          disabled={!isFormValid || isLoading}
          onClick={handleFinish}
        >
          {isLoading ? 'Загрузка...' : 'Опубликовать'}
        </button>
      </div>
    </div>
  )
}
