import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { setStep, completeStep, setIsEditingRoom, resetDraft } from '../../model/listingSlice';
import { useGetRoomsQuery, useDeleteRoomMutation, useAddRoomMutation, usePublishListingMutation } from '../../api/listingApi';
import { useNavigate } from 'react-router-dom';
import commonStyles from '../ListingCreate.module.css';
import styles from './StepRooms.module.css';
import { RoomForm } from './RoomForm';
import { StepRoomsCategory } from './StepRoomsCategory';
import { Pencil, Trash2, Plus, Users, Move, AlertCircle } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';
import { ModerationHint } from '../../../../shared/ui/ModerationHint/ModerationHint';

export const StepRooms = () => {
  const dispatch = useDispatch();
  const { id, moderationDetails } = useSelector((state: RootState) => state.listingCreate);
  const { data: roomsData, isLoading } = useGetRoomsQuery(id || '', { skip: !id });
  const [deleteRoom] = useDeleteRoomMutation();
  const [addRoom, { isLoading: isAddingRoom }] = useAddRoomMutation();
  const [publishListing, { isLoading: isPublishing }] = usePublishListingMutation();
  const navigate = useNavigate();
  
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const isEditingRoom = useSelector((state: RootState) => state.listingCreate.isEditingRoom);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [initialRoomData, setInitialRoomData] = useState<any>(null);
  const [showErrors, setShowErrors] = useState(false);

  const rooms = roomsData?.data || [];

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setInitialRoomData(null);
    setShowRoomForm(true);
    dispatch(setIsEditingRoom(true));
  };

  const handleAddStart = () => {
    setShowCategorySelector(true);
  };

  const handleSelectNewType = async (type: string) => {
    if (!id) return;
    try {
      // 1. Сначала создаем номер в базе
      const result = await addRoom({ 
        id, 
        data: { 
          type, 
          title: type,
          quantity: 1,
          capacityAdults: 2,
          capacityChildren: 0,
          area: 20,
          pricePerDay: 3500,
          beds: [{ type: 'Двуспальная', count: 1 }],
          amenities: []
        } 
      }).unwrap();
      
      const newRoom = result.data;
      
      // 2. Открываем форму с полученным ID
      setEditingRoom(newRoom);
      setInitialRoomData(null);
      setShowCategorySelector(false);
      setShowRoomForm(true);
      dispatch(setIsEditingRoom(true));
      setShowErrors(false);
    } catch (err) {
      console.error('Failed to create new room:', err);
    }
  };

  const handleSelectExisting = async (existingId: string) => {
    if (!id) return;
    try {
      // Прямое добавление существующего объекта как номера
      await addRoom({ 
        id, 
        data: { 
          title: 'Связанный объект', 
          type: 'APARTMENT',
          quantity: 1,
          pricePerDay: 0,
          area: 20,
          capacityAdults: 2,
          capacityChildren: 0,
          beds: [{ type: 'Двуспальная', count: 1 }],
          amenities: []
        } 
      }).unwrap();
      
      setShowCategorySelector(false);
      setShowErrors(false);
    } catch (err) {
      console.error('Failed to add existing room:', err);
    }
  };

  const handlePublish = async () => {
    if (rooms.length === 0) {
      setShowErrors(true);
      return;
    }
    if (!id) return;
    try {
      await publishListing(id).unwrap();
      dispatch(resetDraft());
      navigate('/dashboard');
    } catch (err) {
      console.error('Publishing failed:', err);
    }
  };

  if (isEditingRoom || showRoomForm) {
    return (
      <RoomForm 
        room={editingRoom} 
        initialData={initialRoomData}
        onBack={() => {
          setShowRoomForm(false);
          dispatch(setIsEditingRoom(false));
        }} 
      />
    );
  }

  if (showCategorySelector || (rooms.length === 0 && !isLoading)) {
    return (
      <div className={commonStyles.innerContent}>
        <StepRoomsCategory 
          onSelectNew={handleSelectNewType}
          onSelectExisting={handleSelectExisting}
        />
        {rooms.length > 0 && (
           <button 
             onClick={() => setShowCategorySelector(false)}
             className={commonStyles.backToListBtn}
           >
             ← К списку номеров
           </button>
        )}
        {showErrors && rooms.length === 0 && (
           <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 text-red-700 border border-red-100 mt-6">
             <AlertCircle size={20} />
             <p className="text-[14px] font-semibold">
               Пожалуйста, добавьте хотя бы один номер для продолжения.
             </p>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className={commonStyles.innerContent}>
      <ModerationHint error={moderationDetails?.rooms}>
        <div className={commonStyles.card}>
          <h2 className={commonStyles.sectionTitle}>Номера в объекте</h2>
        
        {(isLoading || isAddingRoom) ? (
          <div className={styles.loadingText}>
            {isAddingRoom ? 'Создание номера...' : 'Загрузка номеров...'}
          </div>
        ) : (
          <div className={styles.roomList}>
            {rooms.map((room: any) => {
              const photosArr = Array.isArray(room.photos) ? room.photos : [];
              const firstPhoto = photosArr[0];
              const mainPhotoStr = typeof firstPhoto === 'object' && firstPhoto !== null 
                ? String(firstPhoto.url || '') 
                : String(firstPhoto || '');
                
              const fullUrl = mainPhotoStr 
                ? (mainPhotoStr.startsWith('http') ? mainPhotoStr : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${mainPhotoStr}`)
                : null;
                
              return (
                <div key={room.id} className={styles.roomCard}>
                  {fullUrl ? (
                    <img src={fullUrl} alt="" className={styles.roomImage} />
                  ) : (
                    <div className={styles.roomImage}>
                      НЕТ ФОТО
                    </div>
                  )}
                  
                  <div className={styles.roomInfo}>
                    <div className={styles.titleWithError}>
                      <h3 className={styles.roomTitle}>{room.title}</h3>
                      {room.status === 'REJECTED' && (
                        <div className={styles.roomErrorBadge} title={room.moderationComment || "Требуется исправление"}>
                          <AlertCircle size={14} />
                          Отказ
                        </div>
                      )}
                    </div>
                    <div className={styles.roomMeta}>
                      <div className={styles.metaItem}>
                        <Users size={14} />
                        <span>{room.capacityAdults} гостя</span>
                      </div>
                      <span className={styles.metaSeparator}>|</span>
                      <div className={styles.metaItem}>
                        <Move size={14} />
                        <span>{room.area} м²</span>
                      </div>
                    </div>
                    <div className={styles.roomPrice}>
                      от {room.pricePerDay} ₽ <span>/ сутки</span>
                    </div>
                  </div>

                  <div className={styles.actionBtnGroup}>
                    <button
                      onClick={() => handleEdit(room)}
                      className={styles.iconBtn}
                      title="Редактировать"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить этот номер из списка?')) {
                          deleteRoom(room.id);
                        }
                      }}
                      className={cn(styles.iconBtn, styles.deleteBtn)}
                      title="Удалить из списка (объект останется в вашем кабинете)"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
            
            <p className="text-[13px] text-slate-500 mt-2">
              <span className="text-amber-500 font-bold">!</span> Удаление номера из этого списка не удаляет его как отдельный объект из вашего кабинета.
            </p>
            
            <button className={styles.addMoreBtn} onClick={handleAddStart}>
              <Plus size={20} />
              Добавить ещё номер
            </button>
          </div>
        )}
        
        {showErrors && rooms.length === 0 && (
           <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 text-red-700 border border-red-100 mt-6">
             <AlertCircle size={20} />
             <p className="text-[14px] font-semibold">
               Пожалуйста, добавьте хотя бы один номер для продолжения.
             </p>
           </div>
        )}
        </div>
      </ModerationHint>

      <div className={commonStyles.footer}>
        <div className={commonStyles.footerContent}>
          <button
            className={cn(commonStyles.btnNext, rooms.length > 0 ? commonStyles.btnNextActive : "opacity-40 cursor-not-allowed grayscale")}
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? 'Публикация...' : 'Опубликовать объявление'}
          </button>
        </div>
      </div>
    </div>
  );
};
