import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../../app/store.ts'
import { updateDraft, setStep } from '../../model/listingSlice'
import styles from '../ListingCreate.module.css'

export const Step4Photos = () => {
  const dispatch = useDispatch()
  const photos = useSelector((state: RootState) => state.listingCreate.photos)

  const handleAddPhoto = () => {
    // В MVP для демонстрации используем prompt, позже заменим на полноценный аплоад
    const url = prompt('Введите URL фотографии (или используйте https://placehold.co/600x400)')
    if (url) {
      dispatch(updateDraft({ photos: [...photos, url] }))
    }
  }

  const handleBack = () => dispatch(setStep(3))
  const handleNext = () => dispatch(setStep(5))

  return (
    <div>
      <h2 className={styles.title}>Добавьте фотографии вашего жилья</h2>
      <div className={styles.grid}>
        <div 
          className={styles.card} 
          onClick={handleAddPhoto}
          style={{ 
            border: '2px dashed rgba(255,255,255,0.2)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>+</div>
          <div style={{ opacity: 0.8 }}>Добавить фото</div>
        </div>
        
        {photos.map((url, i) => (
          <div key={i} className={styles.card} style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
            <img src={url} alt={`Photo ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              onClick={(e) => {
                e.stopPropagation()
                dispatch(updateDraft({ photos: photos.filter((_, idx) => idx !== i) }))
              }}
              style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <button className={styles.btnBack} onClick={handleBack}>Назад</button>
        <button className={styles.btnNext} disabled={photos.length === 0} onClick={handleNext}>Далее</button>
      </div>
    </div>
  )
}
