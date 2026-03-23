import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import type { RootState } from '../../../../app/store';
import { setStep, updateDraft, completeStep } from '../../model/listingSlice';
import { 
  useUploadPhotoMutation, 
  useDeleteListingPhotoMutation, 
  useReorderListingPhotosMutation 
} from '../../api/listingApi';
import styles from '../ListingCreate.module.css';
import gridStyles from './SortablePhotoGrid.module.css';
import { Camera, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../../../shared/lib/utils';
import { SortablePhotoGrid } from './SortablePhotoGrid';
import { ModerationHint } from '../../../../shared/ui/ModerationHint/ModerationHint';

interface PhotoUI {
  id: string;
  url: string;
  thumbnail?: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  file?: File;
}

export const StepPhotos = () => {
  const dispatch = useDispatch();
  const { id, photos: reduxPhotos, moderationDetails } = useSelector((state: RootState) => state.listingCreate);
  const [uploadPhoto] = useUploadPhotoMutation();
  const [deletePhoto] = useDeleteListingPhotoMutation();
  const [reorderPhotos] = useReorderListingPhotosMutation();
  
  const [localPhotos, setLocalPhotos] = useState<PhotoUI[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  // Sync redux photos to local UI state once on mount or when reduxPhotos change meaningfully
  useEffect(() => {
    if (reduxPhotos.length > 0 && localPhotos.length === 0) {
      setLocalPhotos(reduxPhotos.map(p => ({
        id: p.id,
        url: p.url,
        thumbnail: p.thumbnailUrl,
        status: 'success'
      })));
    }
  }, [reduxPhotos]);

  const validateFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.size < 10240) return resolve('Файл слишком мал (минимум 10 КБ)');
      if (file.size > 10 * 1024 * 1024) return resolve('Файл слишком велик (максимум 10 МБ)');

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width < 900 || img.height < 900) {
          resolve(`Низкое разрешение: ${img.width}×${img.height}. Минимум 900×900 px.`);
        } else {
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('Файл поврежден или имеет неверный формат');
      };

      img.src = objectUrl;
    });
  };

  const uploadFile = async (tempId: string, file: File) => {
    if (!id) return;
    try {
      const result = await uploadPhoto({ id, file }).unwrap();
      
      setLocalPhotos(prev => prev.map(p => p.id === tempId ? { 
        ...p, 
        id: result.id, 
        url: result.url, 
        thumbnail: result.thumbnailUrl, 
        status: 'success' as const 
      } : p));
    } catch (err: any) {
      setLocalPhotos(prev => prev.map(p => p.id === tempId ? { 
        ...p, 
        status: 'error' as const, 
        error: err.data?.error || 'Ошибка загрузки' 
      } : p));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remaining = 50 - localPhotos.filter(p => p.status === 'success').length;
    const filesToProcess = acceptedFiles.slice(0, remaining);

    const newPhotos: PhotoUI[] = filesToProcess.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file), // Local preview
      status: 'uploading',
      file
    }));

    setLocalPhotos(prev => [...prev, ...newPhotos]);

    for (const photo of newPhotos) {
      const error = await validateFile(photo.file!);
      if (error) {
        setLocalPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'error', error } : p));
        continue;
      }
      await uploadFile(photo.id, photo.file!);
    }
  }, [localPhotos, id, dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'] },
    maxFiles: 50
  });

  const handleRemove = async (photoId: string) => {
    const photo = localPhotos.find(p => p.id === photoId);
    if (photo?.status === 'success' && id) {
      try {
        await deletePhoto({ id, photoId }).unwrap();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    
    setLocalPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleReorder = (newPhotos: PhotoUI[]) => {
    setLocalPhotos(newPhotos);
    const successPhotos = newPhotos.filter(p => p.status === 'success');
    
    if (id && successPhotos.length > 0) {
      reorderPhotos({ 
        id, 
        photos: successPhotos.map((p, index) => ({ id: p.id, order: index })) 
      }).unwrap().catch(err => console.error('Reorder error:', err));
    }
  };

  // Sync local successful photos back to Redux
  useEffect(() => {
    const successPhotos = localPhotos
      .filter(p => p.status === 'success')
      .map(p => ({ id: p.id, url: p.url, thumbnailUrl: p.thumbnail || p.url }));
    
    // Convert to string for deep comparison to avoid unnecessary updates
    const currentSerialized = JSON.stringify(successPhotos);
    const prevSerialized = JSON.stringify(reduxPhotos);

    if (currentSerialized !== prevSerialized) {
      dispatch(updateDraft({ photos: successPhotos }));
    }
  }, [localPhotos, dispatch, reduxPhotos]);

  const handleNext = () => {
    const successCount = localPhotos.filter(p => p.status === 'success').length;
    if (successCount < 3) {
      setShowErrors(true);
      return;
    }
    dispatch(completeStep(3));
    dispatch(setStep(4));
  };

  const successCount = localPhotos.filter(p => p.status === 'success').length;

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className={styles.innerContent}>
      <ModerationHint error={moderationDetails?.photos}>
        <div className={styles.card}>
          <div className="mb-6">
            <h2 className={styles.sectionTitle} style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              Фотографии — от 3 и больше
            </h2>
            <p style={{ color: '#64748B', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', maxWidth: '700px' }}>
              Добавьте фотографии объекта, относящиеся к территории, зонам общего 
              пользования и т.д. Фото номеров вы сможете добавить на следующих шагах.
            </p>
            <a href="#" style={{ color: '#3E5CDE', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              Советы по добавлению фотографий
            </a>
          </div>

          {localPhotos.length === 0 ? (
            <div
              {...getRootProps()}
              className={gridStyles.emptyDropzone}
            >
              <input {...getInputProps()} />
              <div className={gridStyles.emptyPlus}>+</div>
              <p className={gridStyles.emptyTitle}>
                Добавьте или перетащите минимум 3 фотографии
              </p>
              <p className={gridStyles.emptySubtext}>
                Формат — JPG, PNG и HEIC до 10 МБ, минимум 900 x 900 пикселей
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <SortablePhotoGrid
                photos={localPhotos}
                onReorder={handleReorder}
                onRemove={handleRemove}
                onRetry={(tempId) => {
                  const p = localPhotos.find(x => x.id === tempId);
                  if (p?.file) uploadFile(tempId, p.file);
                }}
                getImageUrl={getImageUrl}
              >
                <div
                  {...getRootProps()}
                  className={gridStyles.addBox}
                >
                  <input {...getInputProps()} />
                  <div className={gridStyles.plusIcon}>+</div>
                </div>
              </SortablePhotoGrid>
            </div>
          )}
          
          {showErrors && successCount < 3 && (
            <div className="flex items-center gap-3 p-5 rounded-[20px] bg-red-50 text-red-700 border border-red-100 mt-8">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-bold m-0">
                Пожалуйста, загрузите минимум 3 фотографии для продолжения.
              </p>
            </div>
          )}
        </div>
      </ModerationHint>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <button
            className={cn(
              styles.btnNext,
              successCount >= 3 ? styles.btnNextActive : "opacity-40 cursor-not-allowed grayscale"
            )}
            disabled={successCount < 3}
            onClick={handleNext}
          >
            {successCount < 3 ? 'Нужно еще фото' : 'Сохранить и продолжить'}
          </button>
        </div>
      </div>
    </div>
  );
};
