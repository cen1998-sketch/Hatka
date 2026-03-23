import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { SortablePhotoGrid } from './SortablePhotoGrid';
import { cn } from '../../../../shared/lib/utils';
import { useUploadRoomPhotoMutation, useDeleteRoomPhotoMutation, useReorderRoomPhotosMutation } from '../../api/listingApi';

interface Photo {
  id: string;
  url: string;
  thumbnail?: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  file?: File; // Store original file for retry
}

interface PhotoUploaderProps {
  listingId: string;
  roomId: string;
  initialPhotos?: any[];
  onPhotosChange?: (photos: any[]) => void;
}

export const PhotoUploader = ({ listingId, roomId, initialPhotos = [], onPhotosChange }: PhotoUploaderProps) => {
  // Map initial photos from DB structure
  const [photos, setPhotos] = useState<Photo[]>(() => 
    initialPhotos.map((p, index) => ({
      id: p.id || `init-${index}`,
      url: p.url,
      thumbnail: p.thumbnail,
      status: 'success'
    }))
  );

  const [uploadRoomPhoto] = useUploadRoomPhotoMutation();
  const [deleteRoomPhoto] = useDeleteRoomPhotoMutation();
  const [reorderRoomPhotos] = useReorderRoomPhotosMutation();

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  };

  const validateFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      // 1. Min size check
      if (file.size < 10240) return resolve('Файл слишком мал (минимум 10 КБ)');
      
      // 2. Max size check
      if (file.size > 10 * 1024 * 1024) return resolve('Файл слишком велик (максимум 10 МБ)');

      // 3. Image dimensions check
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

  const uploadFile = async (id: string, file: File) => {
    if (!roomId) {
      console.error('Cannot upload photo: roomId is missing');
      setPhotos(prev => prev.map(p => p.id === id ? { 
        ...p, 
        status: 'error' as const, 
        error: 'ID номера отсутствует' 
      } : p));
      return;
    }

    try {
      // Update status to uploading
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, status: 'uploading' as const, progress: 0 } : p));

      const result = await uploadRoomPhoto({ id: listingId, roomId, file }).unwrap();
      
      setPhotos(prev => prev.map(p => p.id === id ? { 
        ...p, 
        id: result.id, 
        url: result.url, 
        thumbnail: result.thumbnail, 
        status: 'success' as const 
      } : p));

      // Notify parent if needed
      if (onPhotosChange) {
        setPhotos(current => {
          onPhotosChange(current.filter(p => p.status === 'success'));
          return current;
        });
      }
    } catch (err: any) {
      setPhotos(prev => prev.map(p => p.id === id ? { 
        ...p, 
        status: 'error' as const, 
        error: err.data?.error || 'Ошибка загрузки' 
      } : p));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Limit to 50 photos
    const currentCount = photos.filter(p => p.status === 'success').length;
    const remaining = 50 - currentCount;
    const filesToProcess = acceptedFiles.slice(0, remaining);

    const newPhotos: Photo[] = filesToProcess.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file), // Local preview
      status: 'uploading',
      file
    }));

    setPhotos(prev => [...prev, ...newPhotos]);

    // Process each file
    for (const photo of newPhotos) {
      const error = await validateFile(photo.file!);
      if (error) {
        setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'error', error } : p));
        continue;
      }
      await uploadFile(photo.id, photo.file!);
    }
  }, [photos, listingId, roomId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxFiles: 50
  });

  const handleReorder = async (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    const successPhotos = newPhotos.filter(p => p.status === 'success');
    
    // Call API for persistent reorder
    try {
      await reorderRoomPhotos({ 
        id: listingId, 
        roomId, 
        photos: successPhotos.map((p, index) => ({ ...p, id: p.id, order: index })) 
      }).unwrap();
      
      if (onPhotosChange) onPhotosChange(successPhotos);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  const handleRemove = async (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (photo?.status === 'success') {
      try {
        await deleteRoomPhoto({ id: listingId, roomId, photoId: id }).unwrap();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (onPhotosChange) {
      onPhotosChange(photos.filter(p => p.id !== id && p.status === 'success'));
    }
  };

  const handleRetry = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (photo?.file) {
      uploadFile(id, photo.file);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={isDragActive ? "border-primary bg-primary/5" : ""}
        style={{
          border: '2px dashed #CBD5E1',
          borderRadius: '32px',
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragActive ? '#F8FAFF' : '#FDFDFD',
          borderColor: isDragActive ? '#3E5CDE' : '#CBD5E1',
        }}
        onMouseEnter={(e) => {
          if (!isDragActive) e.currentTarget.style.borderColor = '#94A3B8';
        }}
        onMouseLeave={(e) => {
          if (!isDragActive) e.currentTarget.style.borderColor = '#CBD5E1';
        }}
      >
        <input {...getInputProps()} />
        
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#94A3B8'
        }}>
          <Plus size={32} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            {isDragActive ? "Отпустите для загрузки" : "Перетащите фото сюда"}
          </p>
          <p style={{ fontSize: '15px', color: '#64748B' }}>
            или <span style={{ color: '#3E5CDE', fontWeight: 600 }}>выберите файлы</span> на компьютере
          </p>
        </div>

        <div style={{
          marginTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <span>JPG, PNG, WEBP, HEIC</span>
          <span style={{ color: '#E2E8F0' }}>•</span>
          <span>До 10 МБ</span>
          <span style={{ color: '#E2E8F0' }}>•</span>
          <span>МИН. 900×900 PX</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} className="text-[#3E5CDE]" />
              Загруженные фото
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8', marginLeft: '8px' }}>
                {photos.filter(p => p.status === 'success').length} / 50
              </span>
            </h4>
          </div>
          
          <SortablePhotoGrid
            photos={photos}
            onReorder={handleReorder}
            onRemove={handleRemove}
            onRetry={handleRetry}
            getImageUrl={getImageUrl}
          />
        </div>
      )}
    </div>
  );
};
