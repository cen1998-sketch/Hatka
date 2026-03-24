import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, AlertCircle } from 'lucide-react'
import type { RootState } from '../../../app/store'
import { updateDraft, setStep, setIsEditingRoom } from '../model/listingSlice'
import { useGetListingQuery, useUpdateListingMutation } from '../api/listingApi'
import { Step1TypeCity } from './steps/Step1TypeCity'
import { Step2MainInfo } from './steps/Step2MainInfo'
import { StepPhotos } from './steps/StepPhotos'
import { StepRooms } from './steps/StepRooms'
import { StepPublish } from './steps/StepPublish'
import styles from './ListingCreate.module.css'

const TYPE_MAP: Record<string, string> = {
  'Гостиница': 'HOTEL_ROOM',
  'Квартира': 'APARTMENT',
  'Дом': 'HOUSE',
  'Комната': 'PRIVATE_ROOM'
};

export const ListingCreateWizard = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const step = useSelector((state: RootState) => state.listingCreate.step)
  const title = useSelector((state: RootState) => state.listingCreate.title)
  const status = useSelector((state: RootState) => state.listingCreate.status)
  const moderationComment = useSelector((state: RootState) => state.listingCreate.moderationComment)
  const moderationDetails = useSelector((state: RootState) => state.listingCreate.moderationDetails)
  const stepsCompleted = useSelector((state: RootState) => state.listingCreate.stepsCompleted)
  const isEditingRoom = useSelector((state: RootState) => state.listingCreate.isEditingRoom)

  const { data: listingData } = useGetListingQuery(id || '', { skip: !id })

  const localId = useSelector((state: RootState) => state.listingCreate.id)

  const [updateListing] = useUpdateListingMutation()
  const draft = useSelector((state: RootState) => state.listingCreate)

  // Функция для очистки данных перед отправкой на бэкенд
  const sanitizeDraft = (raw: any) => {
    const allowedFields = [
      'type', 'status', 'title', 'description', 'stepsCompleted',
      'streetType', 'streetName', 'houseNumber', 'building', 'city', 'region',
      'latitude', 'longitude', 'checkIn', 'checkOut', 'yearBuilt', 'roomCount',
      'pricePerDay', 'details', 'amenities', 'moderationComment', 'moderationDetails'
    ];
    
    return Object.fromEntries(
      Object.entries(raw).filter(([key]) => allowedFields.includes(key))
    );
  };

  useEffect(() => {
    // Only initialize draft from API if we haven't loaded this specific ID yet or it's a new ID
    if (listingData?.data && localId !== listingData.data.id) {
      dispatch(updateDraft(listingData.data))
    } else if (!id && searchParams.get('type') && !localId) {
      const rawType = searchParams.get('type') || ''
      const mappedType = TYPE_MAP[rawType] || 'APARTMENT'
      dispatch(updateDraft({ type: mappedType as any }))
    }
  }, [listingData, id, localId, searchParams, dispatch])

  // Автосохранение при выходе или смене шага
  const draftRef = React.useRef(draft)
  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    return () => {
      const latestDraft = draftRef.current
      if (latestDraft.id && latestDraft.stepsCompleted > 0) {
        const { id } = latestDraft
        const sanitizedData = sanitizeDraft(latestDraft)
        console.log('[ListingCreateWizard] Auto-saving sanitized data:', { id, ...sanitizedData, status: 'DRAFT' })
        // @ts-ignore
        updateListing({ id, data: { ...sanitizedData, status: 'DRAFT' } })
      }
    }
  }, [updateListing]) // Only depend on updateListing

  const steps = [
    { id: 1, label: 'Основная информация' },
    { id: 2, label: 'Описание' },
    { id: 3, label: 'Фотографии' },
    { id: 4, label: 'Номера' },
  ]

  const handleStepClick = (stepId: number) => {
    // Can only navigate to already completed steps or the current step
    if (stepId <= stepsCompleted + 1) {
      dispatch(setStep(stepId))
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1TypeCity />
      case 2: return <Step2MainInfo />
      case 3: return <StepPhotos />
      case 4: return <StepRooms />
      case 5: return <StepPublish />
      default: return <Step1TypeCity />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.layoutWrapper}>
        <div className={styles.headerArea}>
          {isEditingRoom ? (
            <button 
              onClick={() => dispatch(setIsEditingRoom(false))}
              className={styles.backLink}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <ChevronLeft size={16} />
              Назад к списку номеров
            </button>
          ) : (
            <Link to="/dashboard" className={styles.backLink}>
              <ChevronLeft size={16} />
              Назад к объектам
            </Link>
          )}
          <h1 className={styles.mainTitle}>
            Отель {title ? `«${title.slice(0, 70)}»` : '«»'}
          </h1>
        </div>

        <div className={styles.contentWrapper}>
          {!isEditingRoom && (
            <aside className={styles.sidebar}>
              {steps.map((s) => {
                const isAvailable = s.id <= stepsCompleted + 1;
                const isActive = step === s.id;
                
                // Check if this step has moderation errors
                const hasError = (s.id === 1 && (moderationDetails?.basics || moderationDetails?.location)) ||
                                 (s.id === 2 && moderationDetails?.basics) ||
                                 (s.id === 3 && moderationDetails?.photos) ||
                                 (s.id === 4 && moderationDetails?.rooms);

                return (
                  <div 
                    key={s.id}
                    className={`
                      ${styles.sidebarItem} 
                      ${isActive ? styles.activeSidebarItem : ''} 
                      ${!isAvailable ? styles.disabledSidebarItem : ''}
                      ${hasError ? styles.errorSidebarItem : ''}
                    `}
                    onClick={() => handleStepClick(s.id)}
                  >
                    {s.label}
                    {hasError && <div className={styles.errorDot} />}
                  </div>
                );
              })}
            </aside>
          )}
          
          <main className={styles.mainContent} style={isEditingRoom ? { marginLeft: 0, width: '100%' } : {}}>
            {status === 'REJECTED' && (
              <div className={styles.rejectionBanner}>
                <div className={styles.rejectionIcon}>
                   <AlertCircle size={20} />
                </div>
                <div className={styles.rejectionText}>
                  <h4 className={styles.rejectionTitle}>Объект отклонен модератором</h4>
                  <p className={styles.rejectionDesc}>{moderationComment || "Пожалуйста, исправьте ошибки в отмеченных разделах и отправьте на повторную проверку."}</p>
                </div>
              </div>
            )}
            {renderStep()}
          </main>
        </div>
      </div>
    </div>
  )
}
